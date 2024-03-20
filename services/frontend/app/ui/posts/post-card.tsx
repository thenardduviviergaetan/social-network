"use client";

import Image from "next/image";
import { formatDateToLocal } from "@/app/lib/utils";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import {
  HeartIcon as Empty_heart,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as Fill_heart } from "@heroicons/react/24/solid";
import { Button } from "@/app/ui/button";
import { followUser } from "@/app/lib/action";
import clsx from "clsx";
import {fetcher} from "@/app/lib/utils"

export default function PostsCard({
  postID,
  post,
  user,
  current
}: {
  postID: string;
  post: any;
  user: string;
  current: string | null | undefined;
}) {

  const { data: commentsCounter } = useSWR(
    // `http://localhost:8000/api/comments/count?post_id=${postID}`,
    `http://${window.location.hostname}:8000/api/comments/count?post_id=${postID}`,
    fetcher,
  );

  const { data: likesData, mutate: mutateLikes } = useSWR(
    // `http://localhost:8000/api/post/likes?id=${postID}&user=${user}`,
    `http://${window.location.hostname}:8000/api/post/likes?id=${postID}&user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: false },
  );

  const { data: followStatus, mutate: mutateFollow } = useSWR(
    // `http://localhost:8000/api/user/follow?user=${user}&author=${post.author_id}`,
    `http://${window.location.hostname}:8000/api/user/follow?user=${user}&author=${post.author_id}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
  );

  const handleLike = async () => {
    try {
      const res = await axios.post(
        // `http://localhost:8000/api/post/likes?id=${postID}`,
        `http://${window.location.hostname}:8000/api/post/likes?id=${postID}`,
        {
          user,
        },
      );
      mutateLikes({ liked: res.data.liked, likecount: res.data.likecount });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await followUser(user, post.author_id);
        mutateFollow({ followed: res.followed, pending: res.pending});
    } catch (error) {
      console.error(error);
    }
  };


  switch (post.status) {
    case "public":
      return (
        <PublicPost
          postID={postID}
          post={post}
          user={user}
          followStatus={followStatus}
          handleFollow={handleFollow}
          likesData={likesData}
          commentsCounter={commentsCounter}
          handleLike={handleLike}
        />
      );
    case "private":
      if (post.author_id === user || (followStatus?.followed && !followStatus?.pending)) {
        return (
          <PublicPost
            postID={postID}
            post={post}
            user={user}
            followStatus={followStatus}
            handleFollow={handleFollow}
            likesData={likesData}
            commentsCounter={commentsCounter}
            handleLike={handleLike}
          />
        );
      }
      return (
        <PrivatePost
          postID={postID}
          post={post}
          user={user}
          followStatus={followStatus}
          handleFollow={handleFollow}
        />
      );
      case 'almost':
        const allowed = post.authorized.split(',').includes(current);
        if (post.author_id === user || allowed) {
          return (
            <PublicPost
            postID={postID}
            post={post}
            user={user}
            followStatus={followStatus}
            handleFollow={handleFollow}
            likesData={likesData}
            commentsCounter={commentsCounter}
            handleLike={handleLike}
            />
          );
        } else {
          return (
            <PrivatePost 
            postID={postID}
            post={post}
            user={user}
            followStatus={followStatus}
            handleFollow={handleFollow}
            />
            );
          }
    default:
      return null;
  }
}

export function PrivatePost({
  postID,
  post,
  user,
  followStatus,
  handleFollow,
}: {
  postID: string;
  post: any;
  user: string;
  followStatus: any;
  handleFollow: () => void;
}) {
  return (
    <div
      id={postID}
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
  postID,
  post,
  user,
  followStatus,
  handleFollow,
  likesData,
  commentsCounter,
  handleLike,
}: {
  postID: string;
  post: any;
  user: string;
  followStatus: any;
  handleFollow: () => void;
  likesData: any;
  commentsCounter: number;
  handleLike: () => void;
}) {
  return (
    <div
      id={postID}
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
            ? <Fill_heart className="w-10 h-10" />
            : <Empty_heart className="w-10 h-10" />}
          <span className="text-sm">
            {likesData?.likecount | 0}
          </span>
        </div>
        <div className="text-purple-700">
          <Link
            href={{ pathname: "/dashboard/posts", query: { id: postID } }}
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
}: {
  post: any;
  user: string;
  followStatus: any;
  handleFollow: () => void;
}){
  return(
    <Button
          onClick={handleFollow}
          className={clsx(
            post.author_id === user ? "hidden" : "block",
            followStatus?.followed
              ? "bg-gray-700 text-white"
              : "bg-purple-500 text-white",
          )}
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
  )
}