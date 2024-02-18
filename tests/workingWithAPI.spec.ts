import { test, expect } from "@playwright/test";
import tags from "../test-data/test.json";

test.beforeEach(async ({ page }) => {
  // thay vi parse url(https://angular.realworld.how/) thi co the viet gon voi pattern nhu duoi
  await page.route("*/**/api/tags", async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.goto("https://angular.realworld.how/");
});

test("has title", async ({ page }) => {
  await expect(page.locator(".navbar-brand")).toHaveText("conduit");
  await page.waitForTimeout(5000);
});
