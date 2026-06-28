-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "companyId" TEXT,
    "tickerSymbol" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "tradeDate" TIMESTAMP(3) NOT NULL,
    "quantity" DECIMAL(20,6) NOT NULL,
    "price" DECIMAL(20,6),
    "fees" DECIMAL(20,6) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "companyId" TEXT,
    "tickerSymbol" TEXT NOT NULL,
    "quantity" DECIMAL(20,6) NOT NULL,
    "averageCost" DECIMAL(20,6),
    "costBasis" DECIMAL(20,6),
    "lastPrice" DECIMAL(20,6),
    "marketValue" DECIMAL(20,6),
    "unrealizedGainLoss" DECIMAL(20,6),
    "unrealizedGainPct" DECIMAL(12,6),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lastPriceUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_portfolioId_idx" ON "Transaction"("portfolioId");

-- CreateIndex
CREATE INDEX "Transaction_tickerSymbol_idx" ON "Transaction"("tickerSymbol");

-- CreateIndex
CREATE INDEX "Transaction_tradeDate_idx" ON "Transaction"("tradeDate");

-- CreateIndex
CREATE INDEX "Transaction_portfolioId_tradeDate_idx" ON "Transaction"("portfolioId", "tradeDate");

-- CreateIndex
CREATE INDEX "PortfolioHolding_userId_idx" ON "PortfolioHolding"("userId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_portfolioId_idx" ON "PortfolioHolding"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_tickerSymbol_idx" ON "PortfolioHolding"("tickerSymbol");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
