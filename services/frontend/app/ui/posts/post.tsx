import Image from "next/image";
import { formatDateToLocal } from "@/app/lib/utils";
import { Button } from "@/app/ui/button";
import CommentForm from "@/app/ui/posts/comment-form";
import Comments from "@/app/ui/posts/comments";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

export function Post({ post }: { post: any }) {
  return (
    <>
      <Link href={`/dashboard/`}>
        <Button className="font-semibold">
          <ArrowLeftCircleIcon className="h-8 w-8 inline-block -mt-1" />
        </Button>
      </Link>
      <div
        id={post.id}
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

        <CommentForm postID={post.id} />

        <div className="mt-4">
          <Comments postID={post.id} />
        </div>
      </div>
    </>
  );
}
