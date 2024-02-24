import {test as setup, expect}   from '@playwright/test';


setup('delete article', async({request})=>{

    const deleteArticleRequest = await request.delete(
        `https://api.realworld.io/api/articles/${process.env.SLUGID}`,
      );
      expect(deleteArticleRequest.status()).toEqual(204);
}) 