import Elysia, { error, t } from "elysia";
import { db } from "./db";
import { InsertUser, usersTable } from "./db/schema";

class Note {
  constructor(public data: string[] = ["Moonhalo"]) {}

  add(note: string) {
    this.data.push(note);
  }

  remove(index: number) {
    this.data.splice(index, 1);
  }

  get(index: number) {
    return this.data[index];
  }

  getAll() {
    return this.data;
  }

  update(index: number, note: string) {
    this.data[index] = note;
  }
}

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export const notes = new Elysia({ prefix: "/notes" })
  .decorate("notes", new Note())
  .onTransform(function log({ body, params, path, request: { method } }) {
    console.log(`${method} ${path}`, {
      body,
      params,
    });
  })
  .get("/", ({ notes }) => notes.getAll())
  .get(
    "/:id",
    async ({ notes, params: { id } }) => {
      await createUser({
        email: "rafeesin@gmail.com",
        password: await Bun.password.hash("applesAreRed"),
        name: "Rafe Esin",
      });

      return notes.get(id) ?? error(404, "Seems like this note doesn't exist");
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  )
  .delete(
    "/:id",
    ({ notes, params: { id } }) => {
      notes.remove(id);
      return notes.getAll();
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  )
  .guard({
    body: t.Object({ note: t.String() }),
  })
  .patch(
    "/:id",
    ({ notes, params: { id }, body }) => {
      notes.update(id, body.note);
      return notes.getAll();
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  )
  .post("/", ({ notes, body }) => {
    notes.add(body.note);
    return notes.getAll();
  });
