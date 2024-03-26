"use client";
import { useEffect } from "react";
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
  param,
  user,
  group
}: {
  page: number;
  urlSegment: string;
  param?: string;
  group?: Number;
  user?: User;
}) {
  const groupID = (group) ? `&ID=${group}` : ""
  const { data: posts, mutate } = useSWR(
    `${API_BASE_URL}/${urlSegment}?page=${page}&limit=${ITEMS_PER_PAGE}&${param}${groupID}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 5000 },
  );

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const res = await fetchPosts(page, urlSegment, param);
        mutate(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPostsData();
  }, [page, urlSegment,param, mutate]);
  
  if (!posts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900">
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {console.log(posts)}
      {posts?.map((post: Post) => (
        <PostCard
          key={post.id}
          post={post}
          user={user?.uuid}
          current={user?.name}
        />
      ))}
    </>
  );
}

