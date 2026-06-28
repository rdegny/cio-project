import { Prisma, TransactionType } from "@prisma/client";

import { validateTransactionInput } from "@/lib/portfolio/calculations";

const DECIMAL_PATTERN = /^-?\d+(\.\d{1,6})?$/;
const TICKER_PATTERN = /^[A-Z0-9.-]{1,15}$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export class PortfolioFormValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortfolioFormValidationError";
  }
}

export type PortfolioFormInput = {
  name: string;
  baseCurrency: string;
  description: string | null;
};

export type TransactionFormInput = {
  portfolioId: string;
  tickerSymbol: string;
  type: TransactionType;
  tradeDate: Date;
  quantity: Prisma.Decimal;
  price: Prisma.Decimal | null;
  fees: Prisma.Decimal;
  currency: string;
  notes: string | null;
};

export function parsePortfolioFormData(formData: FormData): PortfolioFormInput {
  const name = getString(formData, "name").trim();
  const baseCurrency = normalizeCurrency(getString(formData, "baseCurrency") || "USD");
  const description = normalizeOptionalText(getString(formData, "description"), 500);

  if (!name || name.length > 80) {
    throw new PortfolioFormValidationError("Portfolio name must be between 1 and 80 characters.");
  }

  if (!CURRENCY_PATTERN.test(baseCurrency)) {
    throw new PortfolioFormValidationError("Base currency must be a 3-letter currency code.");
  }

  return {
    name,
    baseCurrency,
    description
  };
}

export function parseTransactionFormData(
  formData: FormData,
  userId: string
): TransactionFormInput {
  const portfolioId = getString(formData, "portfolioId");
  const tickerSymbol = normalizeTicker(getString(formData, "tickerSymbol"));
  const type = parseTransactionType(getString(formData, "type"));
  const tradeDate = parseTradeDate(getString(formData, "tradeDate"));
  const quantity = parseDecimal(getString(formData, "quantity"), "Quantity");
  const rawPrice = getString(formData, "price");
  const price = rawPrice ? parseDecimal(rawPrice, "Price") : null;
  const fees = parseDecimal(getString(formData, "fees") || "0", "Fees");
  const currency = normalizeCurrency(getString(formData, "currency") || "USD");
  const notes = normalizeOptionalText(getString(formData, "notes"), 1000);

  if (!portfolioId) {
    throw new PortfolioFormValidationError("Portfolio is required before adding a transaction.");
  }

  if (!TICKER_PATTERN.test(tickerSymbol)) {
    throw new PortfolioFormValidationError("Ticker must be 1-15 characters using letters, numbers, dots, or dashes.");
  }

  if (!CURRENCY_PATTERN.test(currency)) {
    throw new PortfolioFormValidationError("Currency must be a 3-letter currency code.");
  }

  if ((type === TransactionType.BUY || type === TransactionType.SELL) && price === null) {
    throw new PortfolioFormValidationError(`${type} transactions require a price.`);
  }

  validateTransactionInput({
    userId,
    portfolioId,
    tickerSymbol,
    type,
    tradeDate,
    quantity,
    price,
    fees,
    currency
  });

  return {
    portfolioId,
    tickerSymbol,
    type,
    tradeDate,
    quantity,
    price,
    fees,
    currency,
    notes
  };
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeTicker(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeCurrency(value: string): string {
  return value.trim().toUpperCase();
}

function normalizeOptionalText(value: string, maxLength: number): string | null {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maxLength) {
    throw new PortfolioFormValidationError(`Text fields must be ${maxLength} characters or fewer.`);
  }

  return normalized;
}

function parseTransactionType(value: string): TransactionType {
  if (Object.values(TransactionType).includes(value as TransactionType)) {
    return value as TransactionType;
  }

  throw new PortfolioFormValidationError("Transaction type is invalid.");
}

function parseTradeDate(value: string): Date {
  if (!value) {
    throw new PortfolioFormValidationError("Trade date is required.");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new PortfolioFormValidationError("Trade date must be a valid date.");
  }

  return date;
}

function parseDecimal(value: string, label: string): Prisma.Decimal {
  const normalized = value.trim();

  if (!normalized || !DECIMAL_PATTERN.test(normalized)) {
    throw new PortfolioFormValidationError(`${label} must be a decimal value with up to 6 decimal places.`);
  }

  return new Prisma.Decimal(normalized);
}

