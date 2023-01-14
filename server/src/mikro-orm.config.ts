import { __prod__ } from "./constants";
// import { Post } from "./entities/post";
import path from "path";
import { MikroORM } from "@mikro-orm/postgresql";
import { Posts } from "./entity/Posts";
import { User } from "./entity/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    // path to the folder with migrations
    pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: "!(*.d).{js,ts}",
  },
  // This one, as you said, was one of the major issues.
  entitiesDirsTs: ["entity/**"],
  //   entites: [Posts],
  dbName: "learnpg",
  host: "localhost",
  user: "postgres",
  password: "gandapuri",
  type: "postgresql",
  entities: [Posts, User],
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
