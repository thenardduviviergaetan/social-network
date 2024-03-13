import Image from "next/image";
import { formatDateToLocal } from "@/app/lib/utils";

export default async function Posts({
  key,
  post,
}: {
  key: string;
  post: any;
}) {
  return (
    <div id={key} className="bg-white rounded-lg shadow-md p-4 mt-5">
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
      {
        /* {post.image && (
                <Image
                    className="mt-4"
                    src={post.image}
                    alt="Post Image"
                    width={600}
                    height={400} />
            )} */
      }
      <div className="flex justify-between mt-4">
        <button className="text-purple-700">Like</button>
        <button className="text-purple-700">Comment</button>
      </div>
    </div>
  );
}
