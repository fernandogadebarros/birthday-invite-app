import { expect, test } from "@playwright/test";

test("guest confirms with companions and can change the answer", async ({ page }) => {
  await page.goto("/invite/diego-r9fc");
  await expect(page.getByText("Olá, Diego! Você está convidado(a)")).toBeVisible();
  await expect(page.getByLabel("Seu nome")).toHaveValue("Diego Santana");

  const submit = page.getByRole("button", { name: "Confirmar presença →" });
  await page.getByRole("checkbox", { name: /Vou levar acompanhantes/ }).click();
  await page.getByRole("button", { name: "Aumentar" }).click();
  await expect(page.getByText("3 pessoas no total")).toBeVisible();
  await page.getByLabel("Nomes dos acompanhantes").fill("Lia Santana\nBento Santana");
  await expect(page.getByText("2 de 2 nomes informados")).toBeVisible();
  await submit.click();

  await expect(page.getByRole("heading", { name: "Tudo certo, Diego. Te vemos lá!" })).toBeVisible();
  await expect(page.getByText(/Confirmamos 3 pessoas para sábado, 07 de novembro, às 12h/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Tudo certo, Diego. Te vemos lá!" })).toBeVisible();
  await page.getByRole("button", { name: "Alterar resposta" }).click();
  await expect(page.getByLabel("Nomes dos acompanhantes")).toHaveValue("Lia Santana\nBento Santana");
  await page.getByRole("radio", { name: "Não vou" }).click();
  await expect(page.getByText("a Manu vai sentir sua falta")).toBeVisible();
  await page.getByRole("button", { name: "Enviar resposta →" }).click();
  await expect(page.getByRole("heading", { name: "Obrigado por avisar, Diego." })).toBeVisible();
});

test("too many companion names blocks the submit", async ({ page }) => {
  await page.goto("/invite/fernanda-b4zu");
  await page.getByRole("checkbox", { name: /Vou levar acompanhantes/ }).click();
  await page.getByLabel("Nomes dos acompanhantes").fill("Ana\nBia");
  await expect(page.getByText("2 de 1 nomes informados")).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmar presença →" })).toBeDisabled();
});

test("companion names accept commas and must match the count", async ({ page }) => {
  await page.goto("/invite/carla-p8xa");
  await page.getByRole("button", { name: "Alterar resposta" }).click();
  await page.getByRole("checkbox", { name: /Vou levar acompanhantes/ }).click();
  const submit = page.getByRole("button", { name: "Confirmar presença →" });
  const names = page.getByLabel("Nomes dos acompanhantes");

  // 1 companion, "Michael, Pedro" is 2 names.
  await names.fill("Michael, Pedro Pereira");
  await expect(page.getByText(/2 de 1 nomes informados/)).toBeVisible();
  await expect(submit).toBeDisabled();

  // 2 companions, only 1 name.
  await page.getByRole("button", { name: "Aumentar" }).click();
  await names.fill("Michael");
  await expect(page.getByText(/1 de 2 nomes informados · faltam 1/)).toBeVisible();
  await expect(submit).toBeDisabled();

  // 2 companions, 2 names separated by comma.
  await names.fill("Michael, Pedro Pereira");
  await expect(page.getByText("2 de 2 nomes informados")).toBeVisible();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByRole("heading", { name: "Tudo certo, Carla. Te vemos lá!" })).toBeVisible();
});

test("home page has no public RSVP and points to the personal link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Use o link que você recebeu" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Confirmar presença/ })).toHaveCount(0);
});

test("mobile: both cards have the same width and the info grid has no empty cell", async ({ page }) => {
  await page.goto("/invite/marina-k7q2");
  const cards = page.locator("main section");
  const [top, bottom] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
  expect(Math.round(bottom!.width)).toBe(Math.round(top!.width));

  const cell = page.getByText("Onde", { exact: true }).locator("..");
  const grid = cell.locator("..");
  const [cellBox, gridBox] = await Promise.all([cell.boundingBox(), grid.boundingBox()]);
  // On a 390px screen the "Onde" cell fills its own row instead of leaving a pink gap.
  expect(cellBox!.width).toBeGreaterThan(gridBox!.width - 4);
  await expect(page.getByText(/dúvidas\? chame a/)).toHaveCount(0);
});

test("invite shows the looping motion video", async ({ page, request }) => {
  await page.goto("/invite/marina-k7q2");
  const video = page.locator("video");
  await expect(video).toHaveAttribute("src", "/video/invite.mp4");
  await expect(video).toHaveJSProperty("loop", true);
  await expect(video).toHaveJSProperty("muted", true);
  const file = await request.get("/video/invite.mp4");
  expect(file.status()).toBe(200);
  expect(file.headers()["content-type"]).toBe("video/mp4");
});

test("unknown invite code is a 404", async ({ page }) => {
  const response = await page.goto("/invite/ninguem-zzzz");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Não achamos esse convite" })).toBeVisible();
});
