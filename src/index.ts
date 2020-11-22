import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { ApolloServer, gql } from "apollo-server-hapi";
import users from './users.json';


const HOST = "localhost";
const PORT = process.env.PORT || 4000;

const typeDefs = `
  type User {
    name: String!
    lastname: String!
    email: String!
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app: Server = new Server({
  port: PORT,
  host: HOST,
});

async function StartServer() {
  await server.applyMiddleware({
    app,
  });

  await server.installSubscriptionHandlers(app.listener);

  app.route({
    method: "GET",
    path: "/",
    handler: (request: Request, h: ResponseToolkit) => {
      return "Thanks Hapi!";
    },
  });
  //try catch here
  await app.start();
  console.log("Server running on %s", app.info.uri);
}

//as try catch
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

StartServer();
