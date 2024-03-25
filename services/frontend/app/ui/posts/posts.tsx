"use client";
import { Suspense, useEffect } from "react";
import useSWR from "swr";
import { Post } from "@/app/lib/definitions";
import { fetcher } from "@/app/lib/utils";
import { API_BASE_URL, ITEMS_PER_PAGE } from "@/app/lib/constants";
import { User } from "@/app/lib/definitions";
import { fetchPosts } from "@/app/lib/data";
import PostCard from "@/app/ui/posts/post-card";

export default function Posts({
  page,
  urlSegment,
  user,
}: {
  page: number;
  urlSegment: string;
  param?: string;
  user?: User;
}) {
  const { data: posts, mutate } = useSWR(
    `${API_BASE_URL}/${urlSegment}?page=${page}&limit=${ITEMS_PER_PAGE}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 5000 },
  );

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const res = await fetchPosts(page, urlSegment);
        mutate(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostsData();
  }, [page, urlSegment, mutate]);
  

  return (
    <>
      {posts?.map((post: Post) => (
        <PostCard
          key={post.id}
          post={post}
          user={user?.uuid || ""}
          current={user?.name}
        />
      ))}
    </>
  );
}

// export default async function Posts(
//   { page, urlSegment, param }: {
//     page: number;
//     urlSegment: string;
//     param?: string;
//   },
// ) {
//   const session = await auth();
//   const posts = await fetchPosts(page, urlSegment, param);

//   return (
//     posts.map((post: Post) => {
//       return (
//         <>
//             <PostCard
//               key={post.id}
//               post={post}
//               user={session?.user?.uuid}
//               current={session?.user?.name}
//             />
//         </>
//       );
//     })
//   );
// }
