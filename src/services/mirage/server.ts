import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";
import user from "./routes/user";
import * as diary from "./routes/diary";

// Handle errors
export const handleErrors = (error: any, message = "An error occured") =>
  // Return error instance with status code, header, body
  new Response(400, undefined, {
    data: {
      message,
      isError: true,
    },
  });

// Setup server
export const setupServer = (env?: string): Server =>
  // Return server instance with environment, models, seed db and configure mirage to intercept request
  new Server({
    environment: env ?? "development",
    models: {
      entry: Model.extend({
        diary: belongsTo(),
      }),
      diary: Model.extend({
        entry: hasMany(),
        user: belongsTo(),
      }),
      user: Model.extend({
        diary: hasMany(),
      }),
    },
    factories: {
      user: Factory.extend({
        username: "test",
        password: "1234",
        email: "test@test.com",
      }),
    },
    seeds: (server): any => {
      server.create("user");
    },
    routes(): void {
      this.urlPrefix = "https://diaries.app";

      this.post("/auth/signup", user.signup);
      this.post("/auth/login", user.login);

      this.post("/diaries/", diary.create);
      this.post("/diaries/entry/:id", diary.addEntry);

      this.get("/diaries/entries/:id", diary.getEntries);
      this.get("/diaries/:id", diary.getDiaries);

      this.put("/diaries/entry/:id", diary.updateEntry);
      this.put("/diaries/:id", diary.updateDiary);
    },
  });
