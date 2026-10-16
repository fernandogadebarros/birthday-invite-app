import { expect, test, type Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@festa.local";
const ADMIN_PASSWORD = "festa123";

async function login(page: Page) {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Entrar →" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("wrong password or unknown email cannot log in", async ({ page }) => {
  for (const [email, password] of [[ADMIN_EMAIL, "senha-errada"], ["estranho@exemplo.com", ADMIN_PASSWORD]]) {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Senha").fill(password);
    await page.getByRole("button", { name: "Entrar →" }).click();
    await expect(page.getByText("Email ou senha incorretos.")).toBeVisible();
  }
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("admin sees the guest list, filters and sends invites", async ({ page, context }) => {
  await context.route("https://wa.me/**", (route) => route.fulfill({ body: "whatsapp" }));
  await login(page);

  await expect(page.getByRole("heading", { name: "Lista de presença" })).toBeVisible();
  // Seed: Rafael (+2), Carla, Júlia (+3) confirmed -> 3 guests + 5 companions.
  await expect(page.getByText("3 convidados + 5 acompanhantes")).toBeVisible();

  await page.getByRole("radio", { name: "Confirmados" }).click();
  await expect(page.getByText("Rafael Moreira")).toBeVisible();
  await expect(page.getByText("Marina Costa")).toHaveCount(0);
  await page.getByRole("radio", { name: "Todos" }).click();

  await page.getByLabel("Buscar convidado").fill("bru");
  await expect(page.getByText("Bruno Alves")).toBeVisible();
  await expect(page.getByText("Carla Nunes")).toHaveCount(0);
  await page.getByLabel("Buscar convidado").fill("");

  // New guest -> send dialog -> WhatsApp link with the personal URL.
  await page.getByLabel("Novo convidado").fill("Teste Admin");
  await page.getByLabel("WhatsApp").fill("11999990000");
  await expect(page.getByLabel("WhatsApp")).toHaveValue("(11) 99999-0000");
  await page.getByRole("button", { name: "Adicionar e enviar →" }).click();

  const dialog = page.getByRole("dialog", { name: "Enviar convite para Teste" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/\/invite\/teste-[a-z2-9]{4}$/)).toBeVisible();
  await expect(dialog.getByText(/^Oi, Teste! A Manu vai fazer 1 aninho/)).toBeVisible();

  const popupPromise = page.waitForEvent("popup");
  await dialog.getByRole("button", { name: "Abrir no WhatsApp →" }).click();
  const popup = await popupPromise;
  expect(popup.url()).toMatch(/^https:\/\/wa\.me\/5511999990000\?text=Oi%2C%20Teste!.*%2Finvite%2Fteste-/);
  await popup.close();

  const row = page.locator("div.grid", { hasText: "Teste Admin" });
  await expect(row.getByText("enviado agora")).toBeVisible();
  await expect(row.getByRole("button", { name: "Lembrar ↗" })).toBeVisible();

  // Bulk reminder walks through pending guests one chat at a time.
  await page.getByRole("button", { name: /Lembrar pendentes \(\d+\)/ }).click();
  const bulk = page.getByRole("dialog", { name: "Lembrar pendentes" });
  await expect(bulk.getByRole("button", { name: /Abrir chat \(1\/4\) →/ })).toBeVisible();
  const first = page.waitForEvent("popup");
  await bulk.getByRole("button", { name: /Abrir chat \(1\/4\) →/ }).click();
  await (await first).close();
  await expect(bulk.getByRole("button", { name: /Próximo \(2\/4\) →/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bulk).toBeHidden();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("admin list updates by itself when a guest confirms", async ({ page, browser }) => {
  await login(page);
  const row = page.locator("div.grid", { hasText: "Marina Costa" });
  await expect(row.getByText("○ pendente")).toBeVisible();

  const guestPage = await (await browser.newContext()).newPage();
  await guestPage.goto("http://localhost:3000/invite/marina-k7q2");
  await guestPage.getByRole("button", { name: "Confirmar presença →" }).click();
  await expect(guestPage.getByRole("heading", { name: /Tudo certo, Marina/ })).toBeVisible();

  // No reload on the admin tab: the row flips through Supabase Realtime.
  await expect(row.getByText("● vai")).toBeVisible({ timeout: 10_000 });
});

test("admin can delete a guest after confirming", async ({ page }) => {
  await login(page);
  await page.getByLabel("Novo convidado").fill("Para Excluir");
  await page.getByLabel("WhatsApp").fill("11988887777");
  await page.getByRole("button", { name: "Adicionar e enviar →" }).click();
  const sendDialog = page.getByRole("dialog", { name: "Enviar convite para Para" });
  await expect(sendDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sendDialog).toBeHidden();

  const row = page.locator("div.grid", { hasText: "Para Excluir" });
  await expect(row).toBeVisible();

  // Cancel keeps the guest.
  await row.getByRole("button", { name: "Excluir Para Excluir" }).click();
  const dialog = page.getByRole("dialog", { name: "Excluir convidado" });
  await expect(dialog.getByText("Essa ação não pode ser desfeita.")).toBeVisible();
  await dialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(row).toBeVisible();

  // Confirm removes it.
  await row.getByRole("button", { name: "Excluir Para Excluir" }).click();
  await dialog.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page.getByText("Para Excluir")).toHaveCount(0);
});
