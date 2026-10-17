import { expect, test, type Page } from "@playwright/test";

// Runs after the other specs (alphabetical order): it changes the saved event.
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

test("admin edits the event and the invite follows, with an automatic map link", async ({ page, browser }) => {
  await login(page);
  await page.getByRole("button", { name: "Editar evento" }).click();
  const dialog = page.getByRole("dialog", { name: "Editar evento" });
  await expect(dialog.getByLabel("Data")).toHaveValue("2026-11-07");
  await expect(dialog.getByLabel("Hora")).toHaveValue("12:00");
  await expect(dialog.getByLabel("Confirme até")).toHaveValue("2026-10-31");

  // A deadline after the party is refused.
  await dialog.getByLabel("Confirme até").fill("2026-12-30");
  await dialog.getByLabel("Data").fill("2026-12-05");
  await dialog.getByLabel("Hora").fill("15:30");
  await dialog.getByLabel("Local").fill("Salão Azul, Rua das Flores 10");
  await expect(dialog.getByLabel("Onde")).toHaveValue("Quiosque da Amizade");
  await dialog.getByLabel("Onde").fill("Mesa 3");
  await dialog.getByRole("button", { name: "Salvar" }).click();
  await expect(dialog.getByText("O prazo para confirmar deve ser até o dia da festa.")).toBeVisible();

  await dialog.getByLabel("Confirme até").fill("2026-11-30");
  await dialog.getByRole("button", { name: "Salvar" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("sáb 05 dez, 15h30 · Salão Azul, Rua das Flores 10")).toBeVisible();
  await expect(page.getByText(/prazo de confirmação · 30 nov/)).toBeVisible();

  // The guest page shows the new details and the map link comes from the venue text.
  const guest = await (await browser.newContext()).newPage();
  await guest.goto("/invite/bruno-t2hn");
  await expect(guest.getByText("Sábado, 05 dez")).toBeVisible();
  await expect(guest.getByText("15h30", { exact: true })).toBeVisible();
  await expect(guest.getByText("Mesa 3", { exact: true })).toBeVisible();
  await expect(guest.getByText("Salão Azul, Rua das Flores 10", { exact: true })).toBeVisible();
  const href = await guest.getByRole("link", { name: "ver mapa ↗" }).getAttribute("href");
  expect(href).toBe("https://www.google.com/maps/search/?api=1&query=Salão%20Azul%2C%20Rua%20das%20Flores%2010".replace("ã", "%C3%A3"));

  // The WhatsApp message follows the new details.
  await page.getByRole("button", { name: "Reenviar" }).first().click();
  await expect(page.getByLabel("Mensagem")).toHaveValue(/no dia 05\/12, às 15h30, em Salão Azul, Rua das Flores 10.*até 30\/11/);
});
