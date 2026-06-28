import { Prisma, TransactionType } from "@prisma/client";

export type DecimalValue = Prisma.Decimal.Value;

export type PortfolioTransactionInput = {
  id?: string;
  userId: string;
  portfolioId: string;
  companyId?: string | null;
  tickerSymbol: string;
  type: TransactionType;
  tradeDate: Date;
  quantity: DecimalValue;
  price?: DecimalValue | null;
  fees?: DecimalValue | null;
  currency?: string | null;
  createdAt?: Date;
};

export type CalculatedHolding = {
  userId: string;
  portfolioId: string;
  companyId: string | null;
  tickerSymbol: string;
  quantity: Prisma.Decimal;
  averageCost: Prisma.Decimal | null;
  costBasis: Prisma.Decimal | null;
  lastPrice: Prisma.Decimal | null;
  marketValue: Prisma.Decimal | null;
  unrealizedGainLoss: Prisma.Decimal | null;
  unrealizedGainPct: Prisma.Decimal | null;
  currency: string;
  lastPriceUpdatedAt: Date | null;
};

export type PortfolioSummary = {
  totalPositions: number;
  totalCostBasis: Prisma.Decimal;
  totalMarketValue: Prisma.Decimal | null;
  totalUnrealizedGainLoss: Prisma.Decimal | null;
  totalUnrealizedGainPct: Prisma.Decimal | null;
  currency: string | null;
};

