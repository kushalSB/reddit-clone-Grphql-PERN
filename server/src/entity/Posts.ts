import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Posts {
  @Field()
  @PrimaryKey({ type: "number" })
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({
    onUpdate: () => new Date(),
    type: "date",
  })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
