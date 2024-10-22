import { request } from "@playwright/test";

const apiURL = "https://practice.expandtesting.com/notes/api";
const envEmail = process.env.EMAIL ?? "";
const envPassword = process.env.PASSWORD ?? "";
let authToken;

export async function loginAPI(email?: string, password?: string) {
  const context = await request.newContext();
  email = email || envEmail;
  password = password || envPassword;

  const response = await context.post(apiURL + `/users/login`, {
    data: {
      email: email,
      password: password,
    },
  });
  return response;
}

export async function generateAuthToken() {
  const response = await loginAPI();
  const responseBody = JSON.parse(await response.text());
  authToken = responseBody.data.token;
  return authToken;
}

export async function addNoteAPI(
  title: string,
  description: string,
  category: string
) {
  const context = await request.newContext();
  await generateAuthToken();
  const response = await context.post(apiURL + `/notes`, {
    data: {
      title: title,
      description: description,
      category: category,
    },
    headers: {
      "x-auth-token": authToken,
    },
  });
  return response;
}

export async function createNotesApi(title?: string, description?: string, category?: string, providedAuthToken?: string) {
  const context = await request.newContext();
  if (providedAuthToken === undefined && !authToken) {
    await generateAuthToken();
  }
  const authTokenToUse = providedAuthToken ?? authToken;
  const response = await context.post(apiURL + `/notes`,{
    data: {
      title: title,
      description: description,
      category: category
    },
    headers: {
      "x-auth-token": authTokenToUse,
    },
  })
  return response;
}

export async function updateNoteApi(id: string, title: string, description: string, category: string, completed: boolean) {
  const context = await request.newContext()
  await generateAuthToken()
  const response = await context.put(apiURL + `/notes/` + id, {
    data: {
      title: title,
      description: description,
      category: category,
      completed: completed
    },
    headers: {
      "x-auth-token": authToken,
    },
  })
  return response
}

export async function updateNoteStatus(id: string, completed:boolean) {
  const context = await request.newContext()
  await generateAuthToken()
  const response = await context.patch(apiURL + `/notes/`+ id, {
    data:
    {
      completed: completed
    },
    headers: {
      "x-auth-token": authToken,
    },
  })
  return response
}

export async function fetchAllNotesApi() {
  const context = await request.newContext();
  await generateAuthToken();
  const response = await context.get(apiURL + `/notes`, {
    headers: {
      "x-auth-token": authToken,
    },
  });

  return response;
}

export async function deleteNoteApi(id: string) {
  const context = await request.newContext();
  await generateAuthToken();
   const response =  await context.delete(apiURL + `/notes/${id}`, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response
}

export async function deleteAllNotesApi() {
  const context = await request.newContext();
  await generateAuthToken();
  const allNotesApiResponse = await fetchAllNotesApi();
  const allNotesApiResponseBody = JSON.parse(await allNotesApiResponse.text());
  const allNoteIDs = allNotesApiResponseBody.data.map((note) => note.id);

  for (const id of allNoteIDs) {
    await context.delete(apiURL + `/notes/${id}`, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    console.log("Deleted note with ID: " + id);

}}
