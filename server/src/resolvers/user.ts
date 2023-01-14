import { User } from "../entity/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Ctx,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";

//for hashed passwords
import * as argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { emFork }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [
          {
            field: "username error",
            message: "Username less than 3 character",
          },
        ],
      };
    }
    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: "password error",
            message: "Password less than 8 character",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = emFork.create(User, {
      username: options.username,
      password: hashedPassword,
    } as User);
    try {
      await emFork.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [{ field: "username", message: "username already taken" }],
        };
      }
    }

    return { user };
  }

  // return "this is for user";

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,

    @Ctx() { emFork, req }: MyContext
  ): Promise<UserResponse> {
    const user = await emFork.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "that username doesnt exist" }],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Password doesnt match" }],
      };
    }
    req.session.userId = user.id;
    return { user };

    // return "this is for user";
  }
}
