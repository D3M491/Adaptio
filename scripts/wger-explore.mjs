// Dev-only script: downloads the public workout templates of wger to see what they contain.
// The token is read from the WGER_TOKEN environment variable, so it is never saved in the repo.
//
//   PowerShell:  $env:WGER_TOKEN = "your-token"; node scripts/wger-explore.mjs
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE_URL = "https://wger.de/api/v2";
const token = process.env.WGER_TOKEN;

if (!token) {
  console.error("Missing WGER_TOKEN: set it first, see the comment at the top.");
  process.exit(1);
}

const response = await fetch(`${BASE_URL}/public-templates/?limit=50`, {
  headers: { Accept: "application/json", Authorization: `Token ${token}` },
});

if (!response.ok) {
  console.error(`wger answered ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const data = await response.json();
const file = join(tmpdir(), "wger-public-templates.json");
writeFileSync(file, JSON.stringify(data, null, 2));

console.log(`Templates in the first page: ${data.results?.length ?? 0} of ${data.count}`);
for (const template of data.results ?? []) {
  console.log(`- ${template.name ?? template.id}`);
}
console.log(`Full response saved in ${file}`);
