import { test, expect } from "@playwright/test";
import { loginAPI } from "../helper-scripts/api-calls";

const name = "Hanan Test";
const email = process.env.EMAIL ?? "";
const password = process.env.PASSWORD ?? "";

test("Login with correct credentials", async () => {
  const response = await loginAPI(email, password)
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(200);
  expect(responseBody.data.name).toBe(name);
  expect(responseBody.data.email).toBe(email);
  expect(responseBody.data.token).toBeDefined();
});

test("Login with incorrect credentials", async () => {
  const response = await loginAPI(email, "wrongpassword")
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(401);
  expect(responseBody.message).toBe("Incorrect email address or password");
});

test("Login with password that is too long", async () => {
  const response = await loginAPI(email, "Lorem ipsum dolor sit amet, con")
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe(
    "Password must be between 6 and 30 characters"
  );
});

test("Login with invalid email", async () => {
  const response = await loginAPI("test@hanan", password)
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe("A valid email address is required");
});