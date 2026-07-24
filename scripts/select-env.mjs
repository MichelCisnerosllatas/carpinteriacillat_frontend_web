import prompts from "prompts";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envLocalPath = resolve(rootDir, ".env.local");
const envExamplePath = resolve(rootDir, ".env.example");

const APP_ENVS = ["local", "development", "production"];

// Debe reflejar los backends definidos en shared/config/environments.ts.
// Al agregar un backend nuevo alla, sumarlo aca tambien.
const BACKENDS = [
  { key: "core", envVar: "NEXT_PUBLIC_CORE_ENV" },
  // { key: "billing", envVar: "NEXT_PUBLIC_BILLING_ENV" },
];

function readEnvFile(path) {
  if (!existsSync(path)) return {};
  const lines = readFileSync(path, "utf-8").split("\n");
  const entries = {};
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) entries[match[1]] = match[2];
  }
  return entries;
}

function serializeEnvFile(entries) {
  return (
    Object.entries(entries)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n") + "\n"
  );
}

const { backendKey } = await prompts({
  type: "select",
  name: "backendKey",
  message: "Selecciona el backend",
  choices: BACKENDS.map((b) => ({ title: b.key, value: b.key })),
});

if (!backendKey) {
  console.log("Cancelado, no se modifico .env.local");
  process.exit(0);
}

const backend = BACKENDS.find((b) => b.key === backendKey);

const { env } = await prompts({
  type: "select",
  name: "env",
  message: `Selecciona el entorno para "${backend.key}" (${backend.envVar})`,
  choices: APP_ENVS.map((value) => ({ title: value, value })),
});

if (!env) {
  console.log("Cancelado, no se modifico .env.local");
  process.exit(0);
}

const base = existsSync(envLocalPath) ? readEnvFile(envLocalPath) : readEnvFile(envExamplePath);
base[backend.envVar] = env;

writeFileSync(envLocalPath, serializeEnvFile(base));
console.log(`.env.local actualizado -> ${backend.envVar}=${env}`);
