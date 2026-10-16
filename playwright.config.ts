import { execSync } from "node:child_process";
import { defineConfig, devices } from "@playwright/test";

// Keys of the local Supabase stack, read from the CLI so none are committed.
function localSupabaseEnv(): Record<string, string> {
  const out = execSync("pnpm exec supabase status -o env", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const get = (key: string) => out.match(new RegExp(`^${key}="?([^"\\n]+)"?$`, "m"))?.[1] ?? "";
  return {
    NEXT_PUBLIC_SUPABASE_URL: get("API_URL"),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: get("PUBLISHABLE_KEY"),
    SUPABASE_SECRET_KEY: get("SECRET_KEY"),
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  };
}

// E2E runs against the local Supabase stack (`pnpm db:start`) with seed data.
// `pnpm test:e2e` resets the database first, since the tests write to it.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  },
  projects: [
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    // Never reuse a dev server that may be pointing at the cloud project.
    reuseExistingServer: false,
    // Always the local stack, whatever .env.local says; process env wins over .env files.
    env: localSupabaseEnv(),
  },
});
