"use client";

import Image from "next/image";
import { formatDateToLocal } from "@/app/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { HeartIcon as Empty_heart } from "@heroicons/react/24/outline";
import { HeartIcon as Fill_heart } from "@heroicons/react/24/solid";
import { revalidateEvents } from "swr/_internal";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function PostsCard({
  postID,
  post,
  user,
}: {
  postID: string;
  post: any;
  user: string;
}) {
  const { data: commentsCounter } = useSWR(
    `http://localhost:8000/api/comments/count?post_id=${postID}`,
    fetcher,
    );
    
  const { data: likesData} = useSWR(
    `http://localhost:8000/api/post/likes?id=${postID}`,
    fetcher,
  );

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/post/likes?id=${postID}`,
        {
          user,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      id={postID}
      className="bg-white rounded-lg shadow-md p-4 mt-5 max-w-4xl m-auto "
    >
      <div className="flex items-center">
        <Image
          className="w-10 h-10 rounded-full mr-2"
          src={`http://caddy:8000/api/avatar?id=${post.author_id}`}
          alt={post.author}
          width={40}
          height={40}
        />

        <div>
          <p className="font-semibold">{post.author}</p>
          <p className="text-gray-500 text-sm">
            {formatDateToLocal(post.date)}
          </p>
        </div>
      </div>
      <p className="mt-2">{post.content}</p>

      {post.image && (
        <div className="mt-4 flex justify-center">
          <Image
            src={`http://caddy:8000/api/post/image?path=${post.image}`}
            alt="Post image"
            width={500}
            height={500}
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
        <div
          className="flex flex-row justify-center text-purple-700 cursor-pointer"
          onClick={handleLike}
        >
          {likesData?.liked
            ? <Fill_heart className="w-6 h-6" />
            : <Empty_heart className="w-6 h-6" />}
          <span className="text-sm">
            {likesData?.likecount | 0}
          </span>
        </div>
        <div className="text-purple-700">
          <Link href={{ pathname: "dashboard/posts", query: { id: postID } }}>
            Comment({commentsCounter | 0})
          </Link>
        </div>
      </div>
    </div>
  );
}
