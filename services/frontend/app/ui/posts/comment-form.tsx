"use client";

import { useFormState } from "react-dom";
import { createComment } from "@/app/lib/action";
import { Button } from "@/app/ui/button";

export default function CommentForm({ postID }: { postID: string }) {
  const initialState = { message: "", error: {} };
  const [state, setState] = useFormState(createComment, initialState);

  return (
    <form action={setState} className="space-y-4 mt-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Add comment:
        </label>
        <textarea
          id="content"
          name="content"
          placeholder="Content of your comment..."
          className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm mt-1 p-2"
        />

        <input
          type="file"
          id="image"
          name="image"
          className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2 mt-1"
        />

        <input type="hidden" name="postID" value={postID} />

        <div id="content-error">
          {state.errors?.content &&
            state.errors.content.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
