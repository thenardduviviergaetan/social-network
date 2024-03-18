'use client';
import { useFormState, useFormStatus } from "react-dom";
import { createPost } from "@/app/lib/action";
import { Button } from "@/app/ui/button";

export default function Form() {
  const initialState = { message: "", error: {} };
  const [state, setState] = useFormState(createPost, initialState);

  return (
    <main className="w-11/12 m-auto shadow-md p-5">
      <h1 className="text-2xl font-bold mb-4">Create a new post</h1>
      <form action={setState} className="space-y-4">
        <div>
          <label
            htmlFor="content"
            className="block text-md font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Content of your post..."
            className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm mt-1 p-2 resize-none "
          />
          <div id="content-error">
            {state.errors?.content &&
              state.errors.content.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-md font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2 mt-1"
          />
        </div>
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Choose post status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="private"
                  name="status"
                  type="radio"
                  value="private"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Private
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="public"
                  name="status"
                  type="radio"
                  value="public"
                  defaultChecked
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Public
                </label>
              </div>
            </div>
          </div>
          <div id="status-error">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
        <CreateButton />
      </form>
    </main>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-60 justify-center mt-4" aria-disabled={pending}>
      Create
    </Button>
  );
}
