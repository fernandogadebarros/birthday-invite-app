import { expect, test } from "@playwright/test";

test("guest confirms with companions and can change the answer", async ({ page }) => {
  await page.goto("/invite/diego-r9fc");
  await expect(page.getByText("Oi, Diego — você está convidado(a)")).toBeVisible();
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
  await expect(page.getByRole("link", { name: "Adicionar à agenda" })).toHaveAttribute("href", "/calendar.ics");

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

test("generic link registers a new guest and moves to a personal link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Você está convidado(a)")).toBeVisible();
  const submit = page.getByRole("button", { name: "Confirmar presença →" });
  await expect(submit).toBeDisabled();
  await page.getByLabel("Seu nome").fill("Helena Prado");
  await expect(page.getByText("Oi, Helena — você está convidado(a)")).toBeVisible();
  await submit.click();
  await expect(page).toHaveURL(/\/invite\/helena-[a-z2-9]{4}$/);
  await expect(page.getByRole("heading", { name: "Tudo certo, Helena. Te vemos lá!" })).toBeVisible();
});

test("unknown invite code is a 404", async ({ page }) => {
  const response = await page.goto("/invite/ninguem-zzzz");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Não achamos esse convite" })).toBeVisible();
});

test("calendar file describes the party", async ({ request }) => {
  const response = await request.get("/calendar.ics");
  expect(response.headers()["content-type"]).toContain("text/calendar");
  const body = await response.text();
  expect(body).toContain("DTSTART:20261107T150000Z");
  expect(body).toContain("SUMMARY:A Manuela faz 1 aninho!");
});
