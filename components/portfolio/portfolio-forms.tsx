import { TransactionType } from "@prisma/client";

import { addTransactionAction, createPortfolioAction } from "@/app/(app)/portfolio/actions";
import type { PortfolioOption } from "@/app/(app)/portfolio/actions";

export function PortfolioCreateForm() {
  return (
    <form action={createPortfolioAction} className="space-y-4 rounded-lg border border-line bg-white p-5 shadow-panel">
      <div>
        <h2 className="text-lg font-semibold text-ink">Create Portfolio</h2>
      </div>

      <label className="block text-sm font-medium text-ink">
        Name
        <input
          name="name"
          required
          maxLength={80}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
          placeholder="Long-term portfolio"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Base Currency
        <input
          name="baseCurrency"
          defaultValue="USD"
          maxLength={3}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm uppercase text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        Description
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
          placeholder="Optional notes"
        />
      </label>

      <button
        type="submit"
        className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss focus:outline-none focus:ring-2 focus:ring-moss/35"
      >
        Create
      </button>
    </form>
  );
}

export function TransactionEntryForm({
  selectedPortfolio
}: Readonly<{
  selectedPortfolio: PortfolioOption | null;
}>) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={addTransactionAction} className="space-y-4 rounded-lg border border-line bg-white p-5 shadow-panel">
      <div>
        <h2 className="text-lg font-semibold text-ink">Add Transaction</h2>
      </div>

      <input type="hidden" name="portfolioId" value={selectedPortfolio?.id ?? ""} />

      {!selectedPortfolio ? (
        <p className="rounded-md border border-line bg-paper px-3 py-2 text-sm text-zinc-700">
          Create a portfolio before adding transactions.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Ticker
          <input
            name="tickerSymbol"
            required
            maxLength={15}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm uppercase text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            placeholder="AAPL"
            disabled={!selectedPortfolio}
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Type
          <select
            name="type"
            defaultValue={TransactionType.BUY}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            disabled={!selectedPortfolio}
          >
            {Object.values(TransactionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-ink">
          Trade Date
          <input
            type="date"
            name="tradeDate"
            required
            defaultValue={today}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            disabled={!selectedPortfolio}
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Quantity
          <input
            name="quantity"
            required
            inputMode="decimal"
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            placeholder="10"
            disabled={!selectedPortfolio}
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Price
          <input
            name="price"
            inputMode="decimal"
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            placeholder="Optional for dividends and adjustments"
            disabled={!selectedPortfolio}
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Fees
          <input
            name="fees"
            inputMode="decimal"
            defaultValue="0"
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            disabled={!selectedPortfolio}
          />
        </label>

        <label className="block text-sm font-medium text-ink">
          Currency
          <input
            name="currency"
            defaultValue={selectedPortfolio?.baseCurrency ?? "USD"}
            maxLength={3}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm uppercase text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            disabled={!selectedPortfolio}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-ink">
        Notes
        <textarea
          name="notes"
          rows={3}
          maxLength={1000}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
          placeholder="Optional context"
          disabled={!selectedPortfolio}
        />
      </label>

      <button
        type="submit"
        disabled={!selectedPortfolio}
        className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss focus:outline-none focus:ring-2 focus:ring-moss/35 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Add
      </button>
    </form>
  );
}

