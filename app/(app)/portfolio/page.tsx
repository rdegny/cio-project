import Link from "next/link";

import {
  listPortfolioHoldings,
  listPortfolioTransactions,
  listUserPortfolios
} from "@/app/(app)/portfolio/actions";
import { PortfolioCreateForm, TransactionEntryForm } from "@/components/portfolio/portfolio-forms";
import { HoldingsTable, TransactionsTable } from "@/components/portfolio/portfolio-tables";

type PortfolioPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const noticeMessages: Record<string, string> = {
  "portfolio-created": "Portfolio created.",
  "transaction-added": "Transaction recorded and holdings recomputed."
};

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = (await searchParams) ?? {};
  const requestedPortfolioId = getSearchParam(params, "portfolioId");
  const notice = getSearchParam(params, "notice");
  const error = getSearchParam(params, "error");
  const portfolios = await listUserPortfolios();
  const selectedPortfolio =
    portfolios.find((portfolio) => portfolio.id === requestedPortfolioId) ??
    portfolios[0] ??
    null;
  const [holdings, transactions] = selectedPortfolio
    ? await Promise.all([
        listPortfolioHoldings(selectedPortfolio.id),
        listPortfolioTransactions(selectedPortfolio.id)
      ])
    : [[], []];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">
            Portfolio
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
            Manual Tracking
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-700 sm:text-lg">
            Record portfolios and transactions. Current holdings are recomputed from transaction history.
          </p>
        </div>

        {portfolios.length > 0 ? (
          <form className="flex flex-col gap-2 sm:min-w-72" action="/portfolio">
            <label className="text-sm font-medium text-ink" htmlFor="portfolioId">
              Selected Portfolio
            </label>
            <div className="flex gap-2">
              <select
                id="portfolioId"
                name="portfolioId"
                defaultValue={selectedPortfolio?.id}
                className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              >
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-moss hover:text-moss"
              >
                View
              </button>
            </div>
          </form>
        ) : null}
      </section>

      {notice && noticeMessages[notice] ? (
        <StatusMessage tone="success" message={noticeMessages[notice]} />
      ) : null}
      {error ? <StatusMessage tone="error" message={error} /> : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <PortfolioCreateForm />
        <TransactionEntryForm selectedPortfolio={selectedPortfolio} />
      </section>

      {selectedPortfolio ? (
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">{selectedPortfolio.name}</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Base currency: {selectedPortfolio.baseCurrency}
              </p>
            </div>
            {selectedPortfolio.isDefault ? (
              <span className="w-fit rounded-md border border-moss/30 bg-[#f4f8f1] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-moss">
                Default
              </span>
            ) : null}
          </div>
          {selectedPortfolio.description ? (
            <p className="mt-4 text-sm leading-6 text-zinc-700">{selectedPortfolio.description}</p>
          ) : null}
        </section>
      ) : (
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="text-xl font-semibold text-ink">No Portfolio Yet</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Create one portfolio to begin recording manual transactions.
          </p>
        </section>
      )}

      <div className="grid gap-5">
        <HoldingsTable holdings={holdings} />
        <TransactionsTable transactions={transactions} />
      </div>

      <p className="text-sm text-zinc-600">
        Holdings use transaction-derived quantity, average cost, and cost basis only. Market prices,
        market value, and unrealized gain/loss will stay pending until a market data provider exists.
      </p>

      <Link href="/dashboard" className="inline-flex text-sm font-semibold text-moss transition hover:text-ink">
        Back to dashboard
      </Link>
    </div>
  );
}

function StatusMessage({
  tone,
  message
}: Readonly<{
  tone: "success" | "error";
  message: string;
}>) {
  const className =
    tone === "success"
      ? "border-moss/30 bg-[#f4f8f1] text-moss"
      : "border-red-200 bg-red-50 text-red-700";

  return <p className={`rounded-md border px-4 py-3 text-sm font-medium ${className}`}>{message}</p>;
}

function getSearchParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}
