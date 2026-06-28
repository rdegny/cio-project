import { TransactionType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  PortfolioCalculationError,
  calculateHoldingsFromTransactions,
  calculatePortfolioSummary,
  validateTransactionInput
} from "../../lib/portfolio";
import type { PortfolioTransactionInput } from "../../lib/portfolio/types";

const baseTransaction = {
  userId: "user_1",
  portfolioId: "portfolio_1",
  tickerSymbol: "aapl",
  tradeDate: new Date("2026-01-01T00:00:00.000Z"),
  createdAt: new Date("2026-01-01T00:00:00.000Z")
};

function transaction(
  input: Partial<PortfolioTransactionInput> & Pick<PortfolioTransactionInput, "type" | "quantity">
): PortfolioTransactionInput {
  return {
    ...baseTransaction,
    price: "10",
    fees: "0",
    currency: "usd",
    ...input
  };
}

describe("calculateHoldingsFromTransactions", () => {
  it("increases quantity and cost basis for buy transactions including fees", () => {
    const [holding] = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.BUY,
        quantity: "10",
        price: "20",
        fees: "1.50"
      })
    ]);

    expect(holding.tickerSymbol).toBe("AAPL");
    expect(holding.currency).toBe("USD");
    expect(holding.quantity.toString()).toBe("10");
    expect(holding.costBasis?.toString()).toBe("201.5");
    expect(holding.averageCost?.toString()).toBe("20.15");
  });

  it("reduces quantity and cost basis for sells using average cost", () => {
    const [holding] = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.BUY,
        quantity: "10",
        price: "20",
        fees: "0"
      }),
      transaction({
        type: TransactionType.BUY,
        quantity: "10",
        price: "30",
        fees: "0",
        tradeDate: new Date("2026-01-02T00:00:00.000Z")
      }),
      transaction({
        type: TransactionType.SELL,
        quantity: "5",
        price: "40",
        fees: "2",
        tradeDate: new Date("2026-01-03T00:00:00.000Z")
      })
    ]);

    expect(holding.quantity.toString()).toBe("15");
    expect(holding.costBasis?.toString()).toBe("375");
    expect(holding.averageCost?.toString()).toBe("25");
  });

  it("does not change share quantity or cost basis for dividends", () => {
    const [holding] = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.BUY,
        quantity: "4",
        price: "50"
      }),
      transaction({
        type: TransactionType.DIVIDEND,
        quantity: "0",
        price: null,
        tradeDate: new Date("2026-01-02T00:00:00.000Z")
      })
    ]);

    expect(holding.quantity.toString()).toBe("4");
    expect(holding.costBasis?.toString()).toBe("200");
    expect(holding.averageCost?.toString()).toBe("50");
  });

  it("uses signed adjustment quantity as a simple MVP share-count correction", () => {
    const [holding] = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.BUY,
        quantity: "10",
        price: "20"
      }),
      transaction({
        type: TransactionType.ADJUSTMENT,
        quantity: "2",
        price: null,
        tradeDate: new Date("2026-01-02T00:00:00.000Z")
      }),
      transaction({
        type: TransactionType.ADJUSTMENT,
        quantity: "-3",
        price: null,
        tradeDate: new Date("2026-01-03T00:00:00.000Z")
      })
    ]);

    expect(holding.quantity.toString()).toBe("9");
    expect(holding.costBasis?.toString()).toBe("150");
    expect(holding.averageCost?.toString()).toBe("16.666666666666666667");
  });

  it("sorts transactions by tradeDate then createdAt before calculating", () => {
    const [holding] = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.SELL,
        quantity: "1",
        price: "15",
        tradeDate: new Date("2026-01-02T00:00:00.000Z")
      }),
      transaction({
        type: TransactionType.BUY,
        quantity: "2",
        price: "10",
        tradeDate: new Date("2026-01-01T00:00:00.000Z")
      })
    ]);

    expect(holding.quantity.toString()).toBe("1");
    expect(holding.costBasis?.toString()).toBe("10");
  });

  it("rejects selling more shares than are currently held", () => {
    expect(() =>
      calculateHoldingsFromTransactions([
        transaction({
          type: TransactionType.BUY,
          quantity: "1",
          price: "10"
        }),
        transaction({
          type: TransactionType.SELL,
          quantity: "2",
          price: "10",
          tradeDate: new Date("2026-01-02T00:00:00.000Z")
        })
      ])
    ).toThrow(PortfolioCalculationError);
  });
});

describe("validateTransactionInput", () => {
  it("requires prices for buy and sell transactions", () => {
    expect(() =>
      validateTransactionInput(
        transaction({
          type: TransactionType.BUY,
          quantity: "1",
          price: null
        })
      )
    ).toThrow("BUY transaction price must be zero or greater.");
  });
});

describe("calculatePortfolioSummary", () => {
  it("summarizes total positions and cost basis", () => {
    const holdings = calculateHoldingsFromTransactions([
      transaction({
        type: TransactionType.BUY,
        quantity: "2",
        price: "10"
      }),
      transaction({
        portfolioId: "portfolio_1",
        tickerSymbol: "MSFT",
        type: TransactionType.BUY,
        quantity: "3",
        price: "20"
      })
    ]);

    const summary = calculatePortfolioSummary(holdings);

    expect(summary.totalPositions).toBe(2);
    expect(summary.totalCostBasis.toString()).toBe("80");
    expect(summary.totalMarketValue).toBeNull();
    expect(summary.currency).toBe("USD");
  });
});
