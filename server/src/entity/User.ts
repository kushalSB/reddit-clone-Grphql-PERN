import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Field(() => String)
  @Property({ type: "timestamp" })
  createdAt = new Date();

  @Field(() => String)
  @Property({
    onUpdate: () => new Date(),
    type: "timestamp",
  })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Property({ type: "text" })
  password!: string;
}
