import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should return 200`);
  return response.json();
}

const models = await get("/api/models?limit=50");
assert.equal(models.data.pagination.total, 14);

const search = await get("/api/search?q=gpt");
assert.ok(search.data.models.length >= 1);

const compare = await get("/api/compare?ids=gpt-4-1,claude-3-7-sonnet");
assert.equal(compare.data.models.length, 2);

const ranking = await get("/api/rankings?category=coding");
assert.ok(ranking.data);

const company = await get("/api/companies/openai");
assert.equal(company.data.name, "OpenAI");

const provider = await get("/api/providers/openrouter");
assert.equal(provider.data.name, "OpenRouter");

console.log("API smoke tests passed");
