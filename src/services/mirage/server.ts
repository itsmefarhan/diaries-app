import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";

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
    },
  });
