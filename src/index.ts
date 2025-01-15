import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { notes } from "./note";

const app = new Elysia()
  .use(swagger())
  .use(notes)
  .get("/", "Hello From Hanger!!")
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({ id: t.String() }),
  })
  .get("/rafe", "Shadrach Esin")
  .post("/form", ({ body, error }) => {
    console.log(body);
    return body;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
