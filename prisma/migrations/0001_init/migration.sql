-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "contextWindow" INTEGER NOT NULL,
    "maxOutputTokens" INTEGER,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProvider" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "providerId" TEXT,
    "inputPerM" DECIMAL(12,6) NOT NULL,
    "outputPerM" DECIMAL(12,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "unit" TEXT NOT NULL DEFAULT 'million_tokens',
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelCapability" (
    "modelId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,

    CONSTRAINT "ModelCapability_pkey" PRIMARY KEY ("modelId","capabilityId")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelBenchmark" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "score" DECIMAL(10,4) NOT NULL,
    "rank" INTEGER,
    "sourceUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_slug_idx" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Provider_slug_idx" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_releaseDate_idx" ON "Model"("releaseDate");

-- CreateIndex
CREATE INDEX "Model_contextWindow_idx" ON "Model"("contextWindow");

-- CreateIndex
CREATE INDEX "Model_modelType_idx" ON "Model"("modelType");

-- CreateIndex
CREATE INDEX "Model_featured_trending_idx" ON "Model"("featured", "trending");

-- CreateIndex
CREATE UNIQUE INDEX "Model_companyId_name_key" ON "Model"("companyId", "name");

-- CreateIndex
CREATE INDEX "ModelProvider_providerId_idx" ON "ModelProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelProvider_modelId_providerId_key" ON "ModelProvider"("modelId", "providerId");

-- CreateIndex
CREATE INDEX "Pricing_modelId_idx" ON "Pricing"("modelId");

-- CreateIndex
CREATE INDEX "Pricing_inputPerM_idx" ON "Pricing"("inputPerM");

-- CreateIndex
CREATE INDEX "Pricing_outputPerM_idx" ON "Pricing"("outputPerM");

-- CreateIndex
CREATE UNIQUE INDEX "Capability_name_key" ON "Capability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Capability_slug_key" ON "Capability"("slug");

-- CreateIndex
CREATE INDEX "ModelCapability_capabilityId_idx" ON "ModelCapability"("capabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_slug_key" ON "Benchmark"("slug");

-- CreateIndex
CREATE INDEX "Benchmark_category_idx" ON "Benchmark"("category");

-- CreateIndex
CREATE INDEX "ModelBenchmark_benchmarkId_score_idx" ON "ModelBenchmark"("benchmarkId", "score");

-- CreateIndex
CREATE INDEX "ModelBenchmark_modelId_idx" ON "ModelBenchmark"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelBenchmark_modelId_benchmarkId_key" ON "ModelBenchmark"("modelId", "benchmarkId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelBenchmark" ADD CONSTRAINT "ModelBenchmark_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelBenchmark" ADD CONSTRAINT "ModelBenchmark_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
