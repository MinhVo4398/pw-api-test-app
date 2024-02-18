import { test as setup } from "@playwright/test";

const authFile = ".auth/user.json";

setup("authentication", async ({ page }) => {
  await page.goto("https://angular.realworld.how/");
  await page.getByText("Sign in").click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("pwtestminh@test.com");
  await page.getByRole("textbox", { name: "Password" }).fill("123456");
  await page.getByRole("button").click();
  await page.waitForResponse("https://api.realworld.io/api/tags"); // add this to make sure login successfully


  await page.context().storageState({path: authFile});
});
