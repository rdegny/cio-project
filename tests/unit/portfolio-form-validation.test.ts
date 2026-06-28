import { TransactionType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  PortfolioFormValidationError,
  parsePortfolioFormData,
  parseTransactionFormData
} from "../../lib/portfolio/form-validation";

describe("parsePortfolioFormData", () => {
  it("normalizes portfolio input", () => {
    const formData = new FormData();
    formData.set("name", " Core Holdings ");
    formData.set("baseCurrency", "usd");
    formData.set("description", " Long-term account ");

    const input = parsePortfolioFormData(formData);

    expect(input).toEqual({
      name: "Core Holdings",
      baseCurrency: "USD",
      description: "Long-term account"
    });
  });
});

describe("parseTransactionFormData", () => {
  it("normalizes a buy transaction", () => {
    const formData = new FormData();
    formData.set("portfolioId", "portfolio_1");
    formData.set("tickerSymbol", " aapl ");
    formData.set("type", TransactionType.BUY);
    formData.set("tradeDate", "2026-06-28");
    formData.set("quantity", "10");
    formData.set("price", "20.50");
    formData.set("fees", "1.25");
    formData.set("currency", "usd");

    const input = parseTransactionFormData(formData, "user_1");

    expect(input.tickerSymbol).toBe("AAPL");
    expect(input.currency).toBe("USD");
    expect(input.quantity.toString()).toBe("10");
    expect(input.price?.toString()).toBe("20.5");
    expect(input.fees.toString()).toBe("1.25");
  });

  it("requires a price for buy transactions", () => {
    const formData = new FormData();
    formData.set("portfolioId", "portfolio_1");
    formData.set("tickerSymbol", "AAPL");
    formData.set("type", TransactionType.BUY);
    formData.set("tradeDate", "2026-06-28");
    formData.set("quantity", "10");
    formData.set("currency", "USD");

    expect(() => parseTransactionFormData(formData, "user_1")).toThrow(
      PortfolioFormValidationError
    );
  });

  it("allows signed adjustment quantities", () => {
    const formData = new FormData();
    formData.set("portfolioId", "portfolio_1");
    formData.set("tickerSymbol", "AAPL");
    formData.set("type", TransactionType.ADJUSTMENT);
    formData.set("tradeDate", "2026-06-28");
    formData.set("quantity", "-1");
    formData.set("currency", "USD");

    const input = parseTransactionFormData(formData, "user_1");

    expect(input.quantity.toString()).toBe("-1");
    expect(input.price).toBeNull();
  });
});

