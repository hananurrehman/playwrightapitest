import { test, expect } from "@playwright/test";
import {
  addNoteAPI,
  loginAPI,
  deleteAllNotesApi,
} from "../helper-scripts/api-calls";

const email = "hananurrehman@gmail.com";
const name = "Hanan Test";

test("Check login successful", async () => {
  const response = await loginAPI();
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(200);
  expect(responseBody.data.name).toBe(name);
  expect(responseBody.data.email).toBe(email);
  expect(responseBody.data.token).toBeDefined();
});

test("Check login unsuccessful", async () => {
  const response = await loginAPI("", "password");
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(401);
  expect(responseBody.message).toBe("Incorrect email address or password");
});

test("Check password length", async () => {
  const response = await loginAPI("", "Lorem ipsum dolor sit amet, con");
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe(
    "Password must be between 6 and 30 characters"
  );
});

test("Check email format", async () => {
  const response = await loginAPI("hanan@test", "");
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(400);
  expect(responseBody.message).toBe("A valid email address is required");
});

test("Create note", async () => {
  const response = await addNoteAPI(
    "Test note",
    "Test note from Playwright",
    "Home"
  );
  const responseBody = JSON.parse(await response.text());
  expect(responseBody.status).toBe(200);
  expect(responseBody.message).toBe("Note successfully created");
  expect(responseBody.data.title).toBe("Test note");
});

/* test.only("Delete notes", async () => {
  await deleteAllNotesApi();
}); */
