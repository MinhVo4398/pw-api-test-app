import { test as setup, expect } from '@playwright/test';

setup('create new article', async({request})=>{
    // API create new article
  const articleResponse = await request.post('https://api.realworld.io/api/articles', {
    data: {
      article: {
        title: 'Like test article',
        description: 'This is a test description',
        body: 'This is a test body',
        tagList: [],
      },
    },
  });
  expect(articleResponse.status()).toEqual(201);
  const response = await articleResponse.json();
  const slugId = response.article.slug
  process.env['SLUGID'] = slugId
})
