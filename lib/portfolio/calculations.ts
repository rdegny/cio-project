import { Prisma, TransactionType } from "@prisma/client";

import type {
  CalculatedHolding,
  PortfolioSummary,
  PortfolioTransactionInput
} from "@/lib/portfolio/types";

type HoldingAccumulator = {
  userId: string;
  portfolioId: string;
  companyId: string | null;
  tickerSymbol: string;
  currency: string;
  quantity: Prisma.Decimal;
  costBasis: Prisma.Decimal;
};

export class PortfolioCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortfolioCalculationError";
  }
}

const ZERO = new Prisma.Decimal(0);

export function toDecimal(value: Prisma.Decimal.Value | null | undefined): Prisma.Decimal {
  if (value === null || value === undefined) {
    return ZERO;
  }

  return new Prisma.Decimal(value);
}

export function validateTransactionInput(transaction: PortfolioTransactionInput): void {
  const tickerSymbol = normalizeTicker(transaction.tickerSymbol);
  const quantity = toDecimal(transaction.quantity);
  const price = transaction.price === null || transaction.price === undefined ? null : toDecimal(transaction.price);
  const fees = toDecimal(transaction.fees);

  if (!transaction.userId) {
    throw new PortfolioCalculationError("Transaction userId is required.");
  }

  if (!transaction.portfolioId) {
    throw new PortfolioCalculationError("Transaction portfolioId is required.");
  }

  if (!tickerSymbol) {
    throw new PortfolioCalculationError("Transaction tickerSymbol is required.");
  }

  if (!transaction.tradeDate || Number.isNaN(transaction.tradeDate.getTime())) {
    throw new PortfolioCalculationError("Transaction tradeDate must be a valid date.");
  }

  if (fees.lessThan(ZERO)) {
    throw new PortfolioCalculationError("Transaction fees cannot be negative.");
  }

  if ((transaction.type === TransactionType.BUY || transaction.type === TransactionType.SELL) && quantity.lte(ZERO)) {
    throw new PortfolioCalculationError(`${transaction.type} transaction quantity must be greater than zero.`);
  }

  if ((transaction.type === TransactionType.BUY || transaction.type === TransactionType.SELL) && (!price || price.lt(ZERO))) {
    throw new PortfolioCalculationError(`${transaction.type} transaction price must be zero or greater.`);
  }

  if (transaction.type === TransactionType.DIVIDEND && quantity.lt(ZERO)) {
    throw new PortfolioCalculationError("DIVIDEND transaction quantity cannot be negative.");
  }

  if (transaction.type === TransactionType.ADJUSTMENT && quantity.equals(ZERO)) {
    throw new PortfolioCalculationError("ADJUSTMENT transaction quantity cannot be zero.");
  }
}

export function calculateHoldingsFromTransactions(
  transactions: PortfolioTransactionInput[]
): CalculatedHolding[] {
  const holdings = new Map<string, HoldingAccumulator>();

  for (const transaction of sortTransactions(transactions)) {
    validateTransactionInput(transaction);

    const tickerSymbol = normalizeTicker(transaction.tickerSymbol);
    const currency = normalizeCurrency(transaction.currency);
    const key = getHoldingKey(transaction.portfolioId, tickerSymbol, currency);
    const holding =
      holdings.get(key) ??
      createHoldingAccumulator({
        ...transaction,
        tickerSymbol,
        currency
      });

    if (!holding.companyId && transaction.companyId) {
      holding.companyId = transaction.companyId;
    }

    applyTransactionToHolding(holding, transaction);

    if (holding.quantity.equals(ZERO)) {
      holdings.delete(key);
    } else {
      holdings.set(key, holding);
    }
  }

  return Array.from(holdings.values())
    .filter((holding) => holding.quantity.gt(ZERO))
    .map(toCalculatedHolding)
    .sort((a, b) => a.tickerSymbol.localeCompare(b.tickerSymbol));
}

export function calculatePortfolioSummary(holdings: CalculatedHolding[]): PortfolioSummary {
  const totalCostBasis = holdings.reduce(
    (total, holding) => total.plus(holding.costBasis ?? ZERO),
    ZERO
  );

  const marketValueHoldings = holdings.filter((holding) => holding.marketValue !== null);
  const totalMarketValue =
    marketValueHoldings.length === holdings.length
      ? marketValueHoldings.reduce((total, holding) => total.plus(holding.marketValue ?? ZERO), ZERO)
      : null;

  const totalUnrealizedGainLoss =
    totalMarketValue === null ? null : totalMarketValue.minus(totalCostBasis);
  const totalUnrealizedGainPct =
    totalMarketValue === null || totalCostBasis.equals(ZERO)
      ? null
      : totalUnrealizedGainLoss?.div(totalCostBasis).times(100) ?? null;

  return {
    totalPositions: holdings.length,
    totalCostBasis,
    totalMarketValue,
    totalUnrealizedGainLoss,
    totalUnrealizedGainPct,
    currency: getSummaryCurrency(holdings)
  };
}

function applyTransactionToHolding(
  holding: HoldingAccumulator,
  transaction: PortfolioTransactionInput
): void {
  const quantity = toDecimal(transaction.quantity);
  const price = toDecimal(transaction.price);
  const fees = toDecimal(transaction.fees);

  switch (transaction.type) {
    case TransactionType.BUY:
      holding.quantity = holding.quantity.plus(quantity);
      holding.costBasis = holding.costBasis.plus(quantity.times(price)).plus(fees);
      return;

    case TransactionType.SELL:
      applySell(holding, quantity);
      return;

    case TransactionType.DIVIDEND:
      return;

    case TransactionType.ADJUSTMENT:
      applyAdjustment(holding, quantity);
      return;
  }
}

function applySell(holding: HoldingAccumulator, quantity: Prisma.Decimal): void {
  if (quantity.gt(holding.quantity)) {
    throw new PortfolioCalculationError(
      `Cannot sell ${quantity.toString()} shares of ${holding.tickerSymbol}; only ${holding.quantity.toString()} are held.`
    );
  }

  const averageCost = getAverageCost(holding);
  holding.quantity = holding.quantity.minus(quantity);
  holding.costBasis = holding.costBasis.minus(averageCost.times(quantity));

  if (holding.quantity.equals(ZERO)) {
    holding.costBasis = ZERO;
  }
}

function applyAdjustment(holding: HoldingAccumulator, quantityDelta: Prisma.Decimal): void {
  const adjustedQuantity = holding.quantity.plus(quantityDelta);

  if (adjustedQuantity.lt(ZERO)) {
    throw new PortfolioCalculationError(
      `Adjustment would reduce ${holding.tickerSymbol} below zero shares.`
    );
  }

  if (quantityDelta.lt(ZERO)) {
    const averageCost = getAverageCost(holding);
    holding.costBasis = holding.costBasis.minus(averageCost.times(quantityDelta.abs()));
  }

  holding.quantity = adjustedQuantity;

  if (holding.quantity.equals(ZERO)) {
    holding.costBasis = ZERO;
  }
}

function createHoldingAccumulator(
  transaction: PortfolioTransactionInput & { tickerSymbol: string; currency: string }
): HoldingAccumulator {
  return {
    userId: transaction.userId,
    portfolioId: transaction.portfolioId,
    companyId: transaction.companyId ?? null,
    tickerSymbol: transaction.tickerSymbol,
    currency: transaction.currency,
    quantity: ZERO,
    costBasis: ZERO
  };
}

function toCalculatedHolding(holding: HoldingAccumulator): CalculatedHolding {
  const averageCost = getAverageCost(holding);

  return {
    userId: holding.userId,
    portfolioId: holding.portfolioId,
    companyId: holding.companyId,
    tickerSymbol: holding.tickerSymbol,
    quantity: holding.quantity,
    averageCost,
    costBasis: holding.costBasis,
    lastPrice: null,
    marketValue: null,
    unrealizedGainLoss: null,
    unrealizedGainPct: null,
    currency: holding.currency,
    lastPriceUpdatedAt: null
  };
}

function getAverageCost(holding: HoldingAccumulator): Prisma.Decimal {
  if (holding.quantity.equals(ZERO)) {
    return ZERO;
  }

  return holding.costBasis.div(holding.quantity);
}

function sortTransactions(transactions: PortfolioTransactionInput[]): PortfolioTransactionInput[] {
  return [...transactions].sort((a, b) => {
    const tradeDateDiff = a.tradeDate.getTime() - b.tradeDate.getTime();

    if (tradeDateDiff !== 0) {
      return tradeDateDiff;
    }

    return (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
  });
}

function getHoldingKey(portfolioId: string, tickerSymbol: string, currency: string): string {
  return `${portfolioId}:${tickerSymbol}:${currency}`;
}

function normalizeTicker(tickerSymbol: string): string {
  return tickerSymbol.trim().toUpperCase();
}

function normalizeCurrency(currency: string | null | undefined): string {
  return (currency ?? "USD").trim().toUpperCase();
}

function getSummaryCurrency(holdings: CalculatedHolding[]): string | null {
  if (holdings.length === 0) {
    return null;
  }

  const [firstHolding] = holdings;
  const firstCurrency = firstHolding.currency;
  const hasSingleCurrency = holdings.every((holding) => holding.currency === firstCurrency);

  return hasSingleCurrency ? firstCurrency : null;
}

