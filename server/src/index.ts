import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
// import { Posts } from "./entity/Posts";
import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  const emFork = orm.em.fork();
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ emFork: emFork }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("wassup");
  });
  app.listen(4000, () => {
    console.log("server located at localhost:4000");
  });

  // const post = emFork.create(Posts, {
  //   title: "my first post",
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // });
  // await emFork.persistAndFlush(post);

  // const posts = await emFork.find(Posts, {});
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
console.log("new world");
