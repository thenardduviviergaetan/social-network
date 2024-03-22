"use client";

import Image from "next/image";
import { formatDateToLocal } from "@/app/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import {
  HeartIcon as Empty_heart,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as Fill_heart } from "@heroicons/react/24/solid";
import { Button } from "@/app/ui/button";
import { followUser } from "@/app/lib/action";
import { fetcher } from "@/app/lib/utils";
import { useEffect } from "react";
import {
  FollowButtonProps,
  PostCardProps,
  PrivatePostProps,
  PublicPostProps,
} from "@/app/lib/definitions";
import { API_BASE_URL, CADDY_URL } from "@/app/lib/constants";
import {
  fetchCommentsCount,
  fetchFollowStatus,
  fetchLikePost,
  fetchLikes,
} from "@/app/lib/data";

export default function PostsCard({
  post,
  user,
  current,
}: PostCardProps) {

  const { data: commentsCounter, mutate: mutateCommentsCounter } = useSWR(
    `${API_BASE_URL}/comments/count?post_id=${post.id}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 1000,
    },
  );

  const { data: likesData, mutate: mutateLikes } = useSWR(
    `${API_BASE_URL}/post/likes?id=${post.id}&user=${user}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 1000,
    },
  );

  const { data: followStatus, mutate: mutateFollow } = useSWR(
    `${API_BASE_URL}/user/follow?user=${user}&author=${post.author_id}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 1000,
    },
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsRes] = await Promise.all([
          fetchCommentsCount(post.id),
          fetchLikes(post.id, user),
          fetchFollowStatus(user, post.author_id),
        ]);
        mutateCommentsCounter(commentsRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [
    post.id,
    user,
    post.author_id,
    mutateCommentsCounter,
  ]);

  const handleLike = async () => {
    try {
      const res = await fetchLikePost(post.id, user);
      mutateLikes(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await followUser(user, post.author_id);
      mutateFollow(res);
    } catch (error) {
      console.error(error);
    }
  };

  let PostComponent = null;
  let postProps = {};

  switch (post.status) {
    case "public":
      PostComponent = PublicPost;
      postProps = {
        post,
        user,
        followStatus,
        handleFollow,
        likesData,
        commentsCounter,
        handleLike,
      };
      break;
    case "private":
      if (
        post.author_id === user ||
        (followStatus?.followed && !followStatus?.pending)
      ) {
        PostComponent = PublicPost;
        postProps = {
          post,
          user,
          followStatus,
          handleFollow,
          likesData,
          commentsCounter,
          handleLike,
        };
      } else {
        PostComponent = PrivatePost;
        postProps = {
          post,
          user,
          followStatus,
          handleFollow,
        };
      }
      break;
    case "almost":
      const allowed = (post.authorized ?? "").split(",").includes(
        current as string,
      );
      if (post.author_id === user || allowed) {
        PostComponent = PublicPost;
        postProps = {
          post,
          user,
          followStatus,
          handleFollow,
          likesData,
          commentsCounter,
          handleLike,
        };
      } else {
        PostComponent = PrivatePost;
        postProps = {
          post,
          user,
          followStatus,
          handleFollow,
        };
      }
      break;
    default:
      return null;
  }

  return <PostComponent {...postProps} />;
}

export function PrivatePost({
  post,
  user,
  followStatus,
  handleFollow,
}: PrivatePostProps) {
  return (
    <div
      id={post.id}
      className="bg-white rounded-lg shadow-md p-4 mt-5 max-w-4xl m-auto"
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link
            href={{
              pathname: "/dashboard/profile",
              query: { user: encodeURIComponent(post.author_id) },
            }}
          >
            <Image
              className="w-10 h-10 rounded-full mr-2"
              src={`${CADDY_URL}/avatar?id=${post.author_id}`}
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
          </Link>
        </div>
        <FollowButton
          post={post}
          user={user}
          followStatus={followStatus}
          handleFollow={handleFollow}
        />
      </div>
      <p className="text-center text-gray-500">This post is private</p>
      <p className="text-center text-gray-500 mb-5">
        Follow {post.author} to see this post
      </p>
    </div>
  );
}

export function PublicPost({
  post,
  user,
  followStatus,
  handleFollow,
  likesData,
  commentsCounter,
  handleLike,
}: PublicPostProps) {
  return (
    <div
      id={post.id}
      className="bg-white rounded-lg shadow-md p-4 mt-5 max-w-4xl m-auto "
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link
            href={{
              pathname: "/dashboard/profile",
              query: { user: encodeURIComponent(post.author_id) },
            }}
          >
            <Image
              className="w-10 h-10 rounded-full mr-2"
              src={`${CADDY_URL}/avatar?id=${post.author_id}`}
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
          </Link>
        </div>
        <FollowButton
          post={post}
          user={user}
          followStatus={followStatus}
          handleFollow={handleFollow}
        />
      </div>
      <p className="mt-2">{post.content}</p>

      {post.image && (
        <div className="mt-4 flex justify-center">
          <Image
            src={`${CADDY_URL}/post/image?path=${post.image}`}
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
            ? <Fill_heart className="w-10 h-10" />
            : <Empty_heart className="w-10 h-10" />}
          <span className="text-sm">
            {likesData?.likecount | 0}
          </span>
        </div>
        <div className="text-purple-700">
          <Link
            href={{ pathname: "/dashboard/posts", query: { id: post.id } }}
          >
            Comment({commentsCounter | 0})
          </Link>
        </div>
      </div>
    </div>
  );
}

function FollowButton({
  post,
  user,
  followStatus,
  handleFollow,
}: FollowButtonProps) {
  return (
    <Button
      onClick={handleFollow}
      className={`${post.author_id === user ? "hidden" : "block"}
        ${followStatus?.followed ? "bg-gray-700" : "bg-purple-500"}`}
    >
      {followStatus?.followed
        ? (
          followStatus?.pending
            ? (
              <>
                <span className="mr-2">Pending...</span>
              </>
            )
            : (
              <>
                <span className="mr-2">Unfollow</span>
                <MinusIcon className="w-5 h-5" />
              </>
            )
        )
        : (
          <>
            <span className="mr-2">Follow</span>
            <PlusIcon className="w-5 h-5" />
          </>
        )}
    </Button>
  );
}
