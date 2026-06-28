"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  PortfolioFormValidationError,
  parsePortfolioFormData,
  parseTransactionFormData
} from "@/lib/portfolio/form-validation";
import { recomputePortfolioHoldingsForPortfolio } from "@/lib/portfolio/service";

export type PortfolioOption = {
  id: string;
  name: string;
  baseCurrency: string;
  description: string | null;
  isDefault: boolean;
};

export type HoldingRow = {
  id: string;
  tickerSymbol: string;
  quantity: string;
  averageCost: string | null;
  costBasis: string | null;
  currency: string;
  lastPrice: string | null;
  marketValue: string | null;
};

export type TransactionRow = {
  id: string;
  tickerSymbol: string;
  type: string;
  tradeDate: string;
  quantity: string;
  price: string | null;
  fees: string;
  currency: string;
  notes: string | null;
};

export async function createPortfolioAction(formData: FormData): Promise<void> {
  const userId = await requireCurrentUserId();
  let portfolioId: string;

  try {
    const input = parsePortfolioFormData(formData);
    const portfolioCount = await prisma.portfolio.count({
      where: {
        userId
      }
    });

    const portfolio = await prisma.portfolio.create({
      data: {
        userId,
        name: input.name,
        baseCurrency: input.baseCurrency,
        description: input.description,
        isDefault: portfolioCount === 0
      },
      select: {
        id: true
      }
    });

    portfolioId = portfolio.id;
  } catch (error) {
    redirectWithPortfolioError(error);
  }

  revalidatePath("/portfolio");
  redirect(`/portfolio?portfolioId=${portfolioId}&notice=portfolio-created`);
}

export async function addTransactionAction(formData: FormData): Promise<void> {
  const userId = await requireCurrentUserId();
  let portfolioId: string;

  try {
    const input = parseTransactionFormData(formData, userId);
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: input.portfolioId,
        userId
      },
      select: {
        id: true
      }
    });

    if (!portfolio) {
      throw new PortfolioFormValidationError("Portfolio was not found for the current user.");
    }

    const company = await prisma.company.findUnique({
      where: {
        tickerSymbol: input.tickerSymbol
      },
      select: {
        id: true
      }
    });

    await prisma.transaction.create({
      data: {
        userId,
        portfolioId: portfolio.id,
        companyId: company?.id ?? null,
        tickerSymbol: input.tickerSymbol,
        type: input.type,
        tradeDate: input.tradeDate,
        quantity: input.quantity,
        price: input.price,
        fees: input.fees,
        currency: input.currency,
        notes: input.notes
      }
    });

    await recomputePortfolioHoldingsForPortfolio(userId, portfolio.id);
    portfolioId = portfolio.id;
  } catch (error) {
    redirectWithPortfolioError(error, getFormString(formData, "portfolioId"));
  }

  revalidatePath("/portfolio");
  redirect(`/portfolio?portfolioId=${portfolioId}&notice=transaction-added`);
}

export async function listUserPortfolios(): Promise<PortfolioOption[]> {
  const userId = await requireCurrentUserId();

  return prisma.portfolio.findMany({
    where: {
      userId
    },
    orderBy: [
      {
        isDefault: "desc"
      },
      {
        createdAt: "asc"
      }
    ],
    select: {
      id: true,
      name: true,
      baseCurrency: true,
      description: true,
      isDefault: true
    }
  });
}

export async function listPortfolioHoldings(portfolioId: string): Promise<HoldingRow[]> {
  const userId = await requireCurrentUserId();

  if (!portfolioId) {
    return [];
  }

  const holdings = await prisma.portfolioHolding.findMany({
    where: {
      userId,
      portfolioId
    },
    orderBy: {
      tickerSymbol: "asc"
    }
  });

  return holdings.map((holding) => ({
    id: holding.id,
    tickerSymbol: holding.tickerSymbol,
    quantity: formatDecimal(holding.quantity),
    averageCost: formatNullableDecimal(holding.averageCost),
    costBasis: formatNullableDecimal(holding.costBasis),
    currency: holding.currency,
    lastPrice: formatNullableDecimal(holding.lastPrice),
    marketValue: formatNullableDecimal(holding.marketValue)
  }));
}

export async function listPortfolioTransactions(portfolioId: string): Promise<TransactionRow[]> {
  const userId = await requireCurrentUserId();

  if (!portfolioId) {
    return [];
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      portfolioId
    },
    orderBy: [
      {
        tradeDate: "desc"
      },
      {
        createdAt: "desc"
      }
    ],
    take: 50
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    tickerSymbol: transaction.tickerSymbol,
    type: transaction.type,
    tradeDate: transaction.tradeDate.toISOString().slice(0, 10),
    quantity: formatDecimal(transaction.quantity),
    price: formatNullableDecimal(transaction.price),
    fees: formatDecimal(transaction.fees),
    currency: transaction.currency,
    notes: transaction.notes
  }));
}

async function requireCurrentUserId(): Promise<string> {
  const session = await getCurrentSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

function redirectWithPortfolioError(error: unknown, portfolioId?: string): never {
  const message =
    error instanceof PortfolioFormValidationError
      ? error.message
      : "Portfolio action failed. Review the input and try again.";
  const params = new URLSearchParams({
    error: message
  });

  if (portfolioId) {
    params.set("portfolioId", portfolioId);
  }

  redirect(`/portfolio?${params.toString()}`);
}

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function formatDecimal(value: Prisma.Decimal): string {
  return value.toFixed();
}

function formatNullableDecimal(value: Prisma.Decimal | null): string | null {
  return value ? formatDecimal(value) : null;
}
