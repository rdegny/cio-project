import { prisma } from "@/lib/db/prisma";
import { calculateHoldingsFromTransactions } from "@/lib/portfolio/calculations";

export async function recomputePortfolioHoldingsForPortfolio(
  userId: string,
  portfolioId: string
) {
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: portfolioId,
      userId
    },
    select: {
      id: true
    }
  });

  if (!portfolio) {
    throw new Error("Portfolio not found for user.");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      portfolioId
    },
    orderBy: [
      {
        tradeDate: "asc"
      },
      {
        createdAt: "asc"
      }
    ]
  });

  const holdings = calculateHoldingsFromTransactions(transactions);

  await prisma.$transaction(async (tx) => {
    await tx.portfolioHolding.deleteMany({
      where: {
        userId,
        portfolioId
      }
    });

    if (holdings.length === 0) {
      return;
    }

    await tx.portfolioHolding.createMany({
      data: holdings.map((holding) => ({
        userId: holding.userId,
        portfolioId: holding.portfolioId,
        companyId: holding.companyId,
        tickerSymbol: holding.tickerSymbol,
        quantity: holding.quantity,
        averageCost: holding.averageCost,
        costBasis: holding.costBasis,
        lastPrice: holding.lastPrice,
        marketValue: holding.marketValue,
        unrealizedGainLoss: holding.unrealizedGainLoss,
        unrealizedGainPct: holding.unrealizedGainPct,
        currency: holding.currency,
        lastPriceUpdatedAt: holding.lastPriceUpdatedAt
      }))
    });
  });

  return holdings;
}

