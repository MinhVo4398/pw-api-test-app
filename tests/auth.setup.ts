import { test as setup } from "@playwright/test";
import user from '../.auth/user.json';
import fs, { access } from 'fs'; // working with the file, we need to import

const authFile = ".auth/user.json";

setup("authentication", async ({ request }) => {
  // Call api login to get token
  const response = await request.post("https://api.realworld.io/api/users/login",
    {
      data: {
        user: { email: "pwtestminh@test.com", password: "123456" },
      },
    }
  );
  const responseBody = await response.json();
  const accessToken = responseBody.user.token;
  // Get token from the user.json
  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env['ACCESS_TOKEN'] = accessToken;
});
