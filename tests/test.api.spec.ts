import { test, expect } from "@playwright/test";
import { generateAuthToken } from "../helper-scripts/api-calls";

const name = "Hanan Test";
const email = process.env.EMAIL ?? "";
const password = process.env.PASSWORD ?? "";
let authToken: string

test.beforeAll(async () => {
  authToken = await generateAuthToken();
});

test("Login with correct credentials", async ({ request }) => {
  const response = await request.post("users/login", {
    data: {
      email: email,
      password: password,
    },
  });
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(200);
  expect(responseBody.data.name).toBe(name);
  expect(responseBody.data.email).toBe(email);
  expect(responseBody.data.token).toBeDefined();
});

test("Login with incorrect credentials", async ({ request }) => {
  const response = await request.post("users/login", {
    data: {
      email: email,
      password: "wrongpassword",
    },
  });
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(401);
  expect(responseBody.message).toBe("Incorrect email address or password");
});

test("Login with password that is too long", async ({ request }) => {
  const response = await request.post("users/login", {
    data: {
      email: email,
      password: "Lorem ipsum dolor sit amet, con",
    },
  });
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe(
    "Password must be between 6 and 30 characters"
  );
});

test("Login with invalid email", async ({ request }) => {
  const response = await request.post("users/login", {
    data: {
      email: "test@hanan",
      password: password,
    },
  });
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe("A valid email address is required");
});

test("Create a note", async ({ request }) => {
  const response = await request.post("notes", {
    data: {
      title: "Test note",
      description: "Test note from Playwright",
      category: "Home",
    },
    headers: {
      "x-auth-token": authToken,
    },
  });

  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(200);
  expect(responseBody.message).toBe("Note successfully created");
  expect(responseBody.data.title).toBe("Test note");
});
