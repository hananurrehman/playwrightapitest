import { request } from "@playwright/test";

export async function loginAPI(email: string, password: string) {
  const context = await request.newContext();
  const response = await context.post(
    `https://practice.expandtesting.com/notes/api/users/login`,
    {
      data: {
        email: email,
        password: password,
      },
    }
  );
  return response;
}
