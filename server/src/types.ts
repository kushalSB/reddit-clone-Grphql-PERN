import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  emFork: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

declare module "express-session" {
  export interface Session {
    userId: number;
  }
}
