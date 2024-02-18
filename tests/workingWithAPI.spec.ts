import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://angular.realworld.how/');
})

test('has title', async ({ page }) => {
  await expect(page.locator(".navbar-brand")).toHaveText("conduit");
});


