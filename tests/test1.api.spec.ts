import { test, expect } from "@playwright/test";
import { loginAPI } from "../api-calls";

const email = "hananurrehman@gmail.com";
const password = "123456";
const name = "Hanan Test";
let authToken: string;

test("Check login successful", async () => {
  const response = await loginAPI(email, password);
  expect(response.status()).toBe(200);
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.data.name).toBe(name);
  expect(responseBody.data.email).toBe(email);
  expect(responseBody.data.token).toBeDefined();
  authToken = responseBody.data.token;
});

test("Check login unsuccessful", async ({ request }) => {
  const response = await loginAPI(email, "password");
  expect(response.status()).toBe(401);
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.message).toBe("Incorrect email address or password");
});

test("Check password length", async ({ request }) => {
  const response = await loginAPI(email, "Lorem ipsum dolor sit amet, con");
  expect(response.status()).toBe(400);
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.message).toBe(
    "Password must be between 6 and 30 characters"
  );
});
