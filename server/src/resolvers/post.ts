import { Posts } from "../entity/Posts"; //use relative paths for error like this
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
  //Reading
  @Query(() => [Posts])
  posts(@Ctx() { emFork }: MyContext): Promise<Posts[]> {
    return emFork.find(Posts, {});
  }

  // Find from id
  @Query(() => Posts)
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<Posts | null> {
    return emFork.findOne(Posts, { id });
  }

  @Mutation(() => Posts)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { emFork }: MyContext
  ): Promise<Posts> {
    const post = emFork.create(Posts, {
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await emFork.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Posts, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { emFork }: MyContext
  ): Promise<Posts | null> {
    const post = await emFork.findOne(Posts, { id });
    if (!post) {
      return null;
    }
    console.log(post);
    post.title = title;
    await emFork.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<boolean> {
    try {
      await emFork.nativeDelete(Posts, { id });
    } catch {
      return false;
    }
    return true;
  }
}
