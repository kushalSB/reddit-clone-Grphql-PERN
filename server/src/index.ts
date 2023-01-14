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

import session from "express-session";
import connectRedis from "connect-redis";
import * as redis from "redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  const emFork = orm.em.fork();
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    socket: {
      host: "localhost",
      port: 6379,
    },
    legacyMode: true,
  });
  await redisClient.connect();

  // app.set("trust proxy", !__prod__);
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
        httpOnly: true,
        secure: true,
        sameSite: __prod__ ? "lax" : "none",
      },
      saveUninitialized: false,
      secret: "rupeshisahero",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ emFork: emFork, req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { origin: "https://studio.apollographql.com", credentials: true },
  });

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
