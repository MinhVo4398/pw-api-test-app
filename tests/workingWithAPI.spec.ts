import { test, expect, request } from "@playwright/test";
import tags from "../test-data/test.json";
import { join } from "path";

test.beforeEach(async ({ page }) => {
  // thay vi parse url(https://angular.realworld.how/) thi co the viet gon voi pattern nhu duoi
  await page.route("*/**/api/tags", async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.goto("https://angular.realworld.how/");
  await page.getByText("Sign in").click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("pwtestminh@test.com");
  await page.getByRole("textbox", { name: "Password" }).fill("123456");
  await page.getByRole("button").click();
});

test("has title", async ({ page }) => {
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = "This is a MOCK test title";
    responseBody.articles[0].description = "This is a MOCK description";

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  await page.getByText("Global Feed").click();

  await expect(page.locator(".navbar-brand")).toHaveText("conduit");
  await expect(page.locator("app-article-list h1").first()).toContainText(
    "This is a MOCK test title"
  );
  await expect(page.locator("app-article-list p").first()).toContainText(
    "This is a MOCK description"
  );
  await page.waitForTimeout(5000);
});

test("Delete article", async ({ page, request }) => {
  // API to login
  const response = await request.post(
    "https://api.realworld.io/api/users/login",
    {
      data: {
        user: { email: "pwtestminh@test.com", password: "123456" },
      },
    }
  );
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  console.log(responseBody.user.token);

  // API create new article
  const articleResponse = await request.post(
    "https://api.realworld.io/api/articles",
    {
      data: {
        article: {
          title: "This is a test article",
          description: "This is a test description",
          body: "This is a test body",
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );
  expect(articleResponse.status()).toEqual(201);

  //  delete article
  await page.getByText("Global Feed").click();
  await page.getByText("This is a test article").click();
  await page.getByRole("button", { name: "Delete Article" }).first().click();
  await page.getByText("Global Feed").click();
  await expect(page.locator("app-article-list h1").first()).not.toContainText(
    "This is a test article"
  );
});

test("Create article ", async ({ page, request }) => {
  await page.getByText("New Article").click();
  await page
    .getByRole("textbox", { name: "Article Title" })
    .fill("Playwright is awesome");
  await page
    .getByRole("textbox", { name: "What's this article about?" })
    .fill("About the Playwright");
  await page
    .getByRole("textbox", { name: "Write your article (in markdown)" })
    .fill("We like to use playwright for automation");
  await page.getByRole("button", { name: "Publish Article" }).click();
  //After click publish article, we will wait for this api completed
  const articleResponse = await page.waitForResponse(
    "https://api.realworld.io/api/articles/"
  );
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  await expect(page.locator(".article-page h1")).toContainText(
    "Playwright is awesome"
  );
  await page.getByText("Home").click();
  await page.getByText("Global Feed").click();

  await expect(page.locator("app-article-list h1").first()).toContainText(
    "Playwright is awesome"
  );

  const response = await request.post("https://api.realworld.io/api/users/login",
    {
      data: {
        user: { email: "pwtestminh@test.com", password: "123456" },
      },
    }
  );
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  console.log(responseBody.user.token);

 const deleteArticleRequest = await request.delete(`https://api.realworld.io/api/articles/${slugId}`,{
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })

  expect(deleteArticleRequest.status()).toEqual(204);
});
