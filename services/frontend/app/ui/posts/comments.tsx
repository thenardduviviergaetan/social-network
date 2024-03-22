import { fetchComments } from "@/app/lib/data";
import type { Comment } from "@/app/lib/definitions";
import Image from "next/image";
import { CADDY_URL } from "@/app/lib/constants";

export default async function Comments({ postID }: { postID: string }) {
  const comments = await fetchComments(postID);
  console.log(comments);
  return (
    <div>
      <h4 className="mt-5 mb-2">Comments:</h4>
      {comments.map((comment: Comment) => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export async function CommentComponent({ comment }: { comment: Comment }) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
              <Image
          className="w-10 h-10 rounded-full mr-2"
          src={`${CADDY_URL}/avatar?id=${comment.author_id}`}
          alt={comment.author}
          width={40}
          height={40}
        />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {comment.author}
          </p>
          <p className="text-sm text-gray-500">
            {comment.date.split("T")[0]}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700">{comment.content}</p>
        
        {comment.image && (
          <div className="mt-4">
            <Image
              src={`${CADDY_URL}/comment/image?path=${comment.image}`}
              alt="Comment image"
              width={100}
              height={100}
            />
          </div>
        )}
      </div>
    </div>
  );
}
