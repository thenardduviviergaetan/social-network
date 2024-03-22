import { fetchPosts } from "@/app/lib/data";
import PostCard from "@/app/ui/posts/post-card";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Post } from "@/app/lib/definitions";

export default async function Posts(
  { page, urlSegment, param }: {
    page: number;
    urlSegment: string;
    param?: string;
  },
) {
  const posts = await fetchPosts(page, urlSegment, param);
  const session = await auth();

  return (
    posts.map((post: Post) => {
      return (
        <>
            <PostCard
              key={post.id}
              post={post}
              user={session?.user?.uuid}
              current={session?.user?.name}
            />
        </>
      );
    })
  );
}
