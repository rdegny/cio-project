import type { HoldingRow, TransactionRow } from "@/app/(app)/portfolio/actions";

export function HoldingsTable({
  holdings
}: Readonly<{
  holdings: HoldingRow[];
}>) {
  return (
    <section className="rounded-lg border border-line bg-white shadow-panel">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">Holdings</h2>
      </div>
      {holdings.length === 0 ? (
        <EmptyState message="No derived holdings yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-[0.12em] text-zinc-600">
              <tr>
                <th className="px-5 py-3">Ticker</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">Average Cost</th>
                <th className="px-5 py-3">Cost Basis</th>
                <th className="px-5 py-3">Last Price</th>
                <th className="px-5 py-3">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {holdings.map((holding) => (
                <tr key={holding.id}>
                  <td className="px-5 py-4 font-semibold text-ink">{holding.tickerSymbol}</td>
                  <td className="px-5 py-4 text-zinc-700">{holding.quantity}</td>
                  <td className="px-5 py-4 text-zinc-700">{formatMoney(holding.averageCost, holding.currency)}</td>
                  <td className="px-5 py-4 text-zinc-700">{formatMoney(holding.costBasis, holding.currency)}</td>
                  <td className="px-5 py-4 text-zinc-500">Pending market data</td>
                  <td className="px-5 py-4 text-zinc-500">Pending market data</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function TransactionsTable({
  transactions
}: Readonly<{
  transactions: TransactionRow[];
}>) {
  return (
    <section className="rounded-lg border border-line bg-white shadow-panel">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">Transaction History</h2>
      </div>
      {transactions.length === 0 ? (
        <EmptyState message="No transactions recorded yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-[0.12em] text-zinc-600">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Ticker</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Fees</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-5 py-4 text-zinc-700">{transaction.tradeDate}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{transaction.tickerSymbol}</td>
                  <td className="px-5 py-4 text-zinc-700">{transaction.type}</td>
                  <td className="px-5 py-4 text-zinc-700">{transaction.quantity}</td>
                  <td className="px-5 py-4 text-zinc-700">{formatMoney(transaction.price, transaction.currency)}</td>
                  <td className="px-5 py-4 text-zinc-700">{formatMoney(transaction.fees, transaction.currency)}</td>
                  <td className="px-5 py-4 text-zinc-600">{transaction.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EmptyState({ message }: Readonly<{ message: string }>) {
  return <p className="px-5 py-6 text-sm text-zinc-600">{message}</p>;
}

function formatMoney(value: string | null, currency: string): string {
  if (value === null) {
    return "-";
  }

  return `${currency} ${value}`;
}

