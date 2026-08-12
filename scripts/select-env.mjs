import prompts from "prompts";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(rootDir, ".env");
const envExamplePath = resolve(rootDir, ".env.example");

const APP_ENVS = ["local", "development", "production"];

// Debe reflejar los backends definidos en shared/config/environments.ts.
// Al agregar un backend nuevo alla, sumarlo aca tambien.
const BACKENDS = [
  { key: "core", envVar: "NEXT_PUBLIC_CORE_ENV" },
  { key: "billing", envVar: "NEXT_PUBLIC_BILLING_ENV" },
  { key: "media", envVar: "NEXT_PUBLIC_MEDIA_ENV" },
];

// Actualiza (o agrega) UNA variable en un archivo .env sin tocar el resto:
// preserva comentarios, secciones y el orden de todo lo demas.
function setEnvVar(path, fallbackPath, key, value) {
  const source = existsSync(path) ? path : fallbackPath;
  const lines = existsSync(source) ? readFileSync(source, "utf-8").split("\n") : [];

  const pattern = new RegExp(`^${key}=`);
  const index = lines.findIndex((line) => pattern.test(line));

  if (index !== -1) {
    lines[index] = `${key}=${value}`;
  } else {
    lines.push(`${key}=${value}`);
  }

  writeFileSync(path, lines.join("\n"));
}

const { backendKey } = await prompts({
  type: "select",
  name: "backendKey",
  message: "Selecciona el backend",
  choices: BACKENDS.map((b) => ({ title: b.key, value: b.key })),
});

if (!backendKey) {
  console.log("Cancelado, no se modifico .env");
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
  console.log("Cancelado, no se modifico .env");
  process.exit(0);
}

setEnvVar(envPath, envExamplePath, backend.envVar, env);
console.log(`.env actualizado -> ${backend.envVar}=${env}`);
