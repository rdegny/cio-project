import Link from "next/link";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/research", label: "Research" },
  { href: "/themes", label: "Themes" },
  { href: "/alerts", label: "Alerts" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" }
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/dashboard" className="w-fit">
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-moss">
              AI CIO
            </span>
            <span className="mt-1 block text-2xl font-semibold text-ink">
              Investment Command Center
            </span>
          </Link>
          <nav aria-label="Primary navigation" className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-moss hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/35"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
