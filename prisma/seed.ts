import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  ["OpenAI", "openai", "AI research company developing general-purpose models and APIs.", "https://openai.com", "United States"],
  ["Anthropic", "anthropic", "AI safety and research company focused on reliable, interpretable systems.", "https://www.anthropic.com", "United States"],
  ["Google DeepMind", "google-deepmind", "Google's AI research organization spanning foundational models and scientific applications.", "https://deepmind.google", "United Kingdom"],
  ["Meta AI", "meta-ai", "Meta's AI research organization behind open model families and multimodal research.", "https://ai.meta.com", "United States"],
  ["Mistral AI", "mistral-ai", "European AI company producing efficient open and proprietary model families.", "https://mistral.ai", "France"],
  ["xAI", "xai", "AI company building frontier models and developer products.", "https://x.ai", "United States"],
  ["DeepSeek", "deepseek", "AI company focused on open language and reasoning models.", "https://www.deepseek.com", "China"],
] as const;

const providers = [
  ["OpenRouter", "openrouter", "Unified API routing to models from many providers.", "https://openrouter.ai"],
  ["Together AI", "together-ai", "Managed inference platform for open and proprietary models.", "https://www.together.ai"],
  ["Fireworks AI", "fireworks-ai", "Fast generative AI inference platform.", "https://fireworks.ai"],
  ["Groq", "groq", "Low-latency inference platform using custom hardware.", "https://groq.com"],
  ["Google", "google", "Official Google model hosting and AI platform.", "https://ai.google.dev"],
  ["Anthropic", "anthropic-provider", "Official Anthropic API and cloud inference.", "https://www.anthropic.com"],
] as const;

const modelSpecs = [
  ["GPT-4.1", "openai", "Flagship general-purpose model optimized for instruction following and coding.", "Text", 1047576, 32768, "2025-04-14", true, true, 2.00, 8.00],
  ["GPT-4.1 mini", "openai", "Smaller, lower-latency version of GPT-4.1.", "Text", 1047576, 32768, "2025-04-14", false, true, 0.40, 1.60],
  ["Claude 3.7 Sonnet", "anthropic", "Hybrid reasoning model for coding and complex agent workflows.", "Text", 200000, 64000, "2025-02-24", true, true, 3.00, 15.00],
  ["Claude 3.5 Haiku", "anthropic", "Fast model for efficient text and agent applications.", "Text", 200000, 8192, "2024-10-22", false, false, 0.80, 4.00],
  ["Gemini 2.5 Pro", "google-deepmind", "Advanced multimodal reasoning model with a large context window.", "Multimodal", 1048576, 65536, "2025-03-25", true, true, 1.25, 10.00],
  ["Gemini 2.5 Flash", "google-deepmind", "Efficient multimodal model for low-latency workloads.", "Multimodal", 1048576, 65536, "2025-04-17", false, true, 0.15, 0.60],
  ["Llama 4 Maverick", "meta-ai", "Mixture-of-experts multimodal model from the Llama 4 family.", "Multimodal", 1048576, 32768, "2025-04-05", true, true, 0.27, 0.85],
  ["Llama 4 Scout", "meta-ai", "Efficient multimodal model for long-context workloads.", "Multimodal", 1048576, 16384, "2025-04-05", false, false, 0.18, 0.59],
  ["Mistral Large 2", "mistral-ai", "High-capability model for reasoning, coding, and multilingual tasks.", "Text", 128000, 8192, "2024-07-24", false, false, 2.00, 6.00],
  ["Mistral Small 3.1", "mistral-ai", "Compact multimodal model for interactive applications.", "Multimodal", 128000, 8192, "2025-03-17", false, true, 0.10, 0.30],
  ["Grok 3", "xai", "Reasoning-focused model for deep analysis and agentic applications.", "Text", 131072, 32768, "2025-02-17", true, true, 3.00, 15.00],
  ["Grok 3 Mini", "xai", "Efficient reasoning model for faster responses.", "Text", 131072, 32768, "2025-04-09", false, true, 0.30, 0.50],
  ["DeepSeek V3", "deepseek", "Open mixture-of-experts model for general and coding tasks.", "Text", 128000, 8192, "2024-12-26", true, true, 0.27, 1.10],
  ["DeepSeek R1", "deepseek", "Reasoning model trained with reinforcement learning.", "Reasoning", 128000, 32768, "2025-01-20", true, true, 0.55, 2.19],
] as const;

const capabilityNames = [
  ["Text", "text", "modality"],
  ["Image", "image", "modality"],
  ["Audio", "audio", "modality"],
  ["Video", "video", "modality"],
  ["Tool calling", "tool-calling", "feature"],
  ["Structured output", "structured-output", "feature"],
] as const;

const benchmarkSpecs = [
  ["General Performance", "general-performance", "General", "Composite demo index"],
  ["Coding", "coding", "Coding", "Normalized coding demo score"],
  ["Reasoning", "reasoning", "Reasoning", "Normalized reasoning demo score"],
  ["Mathematics", "mathematics", "Math", "Normalized mathematics demo score"],
] as const;

async function main() {
  await prisma.modelBenchmark.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.modelCapability.deleteMany();
  await prisma.capability.deleteMany();
  await prisma.pricing.deleteMany();
  await prisma.modelProvider.deleteMany();
  await prisma.model.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.company.deleteMany();

  for (const [name, slug, description, website, country] of companies) {
    await prisma.company.create({ data: { name, slug, description, website, country } });
  }
  for (const [name, slug, description, website] of providers) {
    await prisma.provider.create({ data: { name, slug, description, website } });
  }
  for (const [name, slug, kind] of capabilityNames) {
    await prisma.capability.create({ data: { name, slug, kind } });
  }
  for (const [name, slug, category, description] of benchmarkSpecs) {
    await prisma.benchmark.create({ data: { name, slug, category, description, scale: "0-100 demo index" } });
  }

  const allProviders = await prisma.provider.findMany();
  let modelIndex = 0;
  for (const [name, companySlug, description, modelType, contextWindow, maxOutputTokens, releaseDate, featured, trending, input, output] of modelSpecs) {
    const company = await prisma.company.findUniqueOrThrow({ where: { slug: companySlug } });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const model = await prisma.model.create({
      data: {
        name, slug, description, modelType, contextWindow, maxOutputTokens,
        releaseDate: new Date(releaseDate), featured, trending, companyId: company.id,
      },
    });

    const selectedProviders = allProviders.slice(modelIndex % 2, Math.min(allProviders.length, (modelIndex % 3) + 3));
    for (const provider of selectedProviders) {
      await prisma.modelProvider.create({
        data: { modelId: model.id, providerId: provider.id, isVerified: provider.slug === "openrouter", verifiedAt: provider.slug === "openrouter" ? new Date("2026-11-21") : null },
      });
      await prisma.pricing.create({
        data: { modelId: model.id, providerId: provider.id, inputPerM: input, outputPerM: output, isDemo: true, sourceUrl: null, verifiedAt: null },
      });
    }

    const text = await prisma.capability.findUniqueOrThrow({ where: { slug: "text" } });
    await prisma.modelCapability.create({ data: { modelId: model.id, capabilityId: text.id } });
    await prisma.modelCapability.create({
      data: { modelId: model.id, capabilityId: (await prisma.capability.findUniqueOrThrow({ where: { slug: "tool-calling" } })).id },
    });
    if (modelType === "Multimodal") {
      for (const slugName of ["image", "audio"]) {
        const capability = await prisma.capability.findUniqueOrThrow({ where: { slug: slugName } });
        await prisma.modelCapability.create({ data: { modelId: model.id, capabilityId: capability.id } });
      }
    }

    const benchmarks = await prisma.benchmark.findMany();
    for (let i = 0; i < benchmarks.length; i++) {
      const base = [78, 72, 75, 70][i] + ((modelIndex * 3 + i * 2) % 17);
      await prisma.modelBenchmark.create({
        data: {
          modelId: model.id, benchmarkId: benchmarks[i].id, score: base,
          rank: modelIndex + i + 1, isDemo: true, isVerified: false,
          sourceUrl: null, lastUpdatedAt: new Date("2026-11-21"),
        },
      });
    }
    modelIndex++;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
