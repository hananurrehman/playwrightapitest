import { deleteAllNotesApi } from "./helper-scripts/api-calls";

async function teardown() {
  await deleteAllNotesApi();
}
export default teardown;
