import { test, expect } from "@playwright/test";
import { generateAuthToken } from "../helper-scripts/api-calls";


let authToken: string
test.beforeAll(async () => {
    authToken = await generateAuthToken();
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