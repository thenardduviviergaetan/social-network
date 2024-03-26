"use client";
import { useFormState, useFormStatus } from "react-dom";
import { State, createPost } from "@/app/lib/action";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { CADDY_URL, API_BASE_URL } from "@/app/lib/constants";
import { set } from "zod";

export default function Form({
  user,
  group
}: {
  user: string | undefined;
  group?: Number | undefined
}) {
  const isGroup = group !== undefined && group !== 0
  const checkGroup = (prevState: State | undefined, formData: FormData) => {
    if (isGroup) {
      formData.set('group_id', String(group))
      formData.set('status', 'group')
    }

    return createPost(prevState, formData)
  }


  const initialState = { message: "", error: {} };
  const [state, setState] = useFormState(checkGroup, initialState);

  const [privacy, setPrivacy] = useState("");

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data: followers } = useSWR(
    `${API_BASE_URL}/user/followers?user=${user}`,
    
    fetcher,
    { revalidateOnFocus: false, revalidateOnMount: true },
  );



  const [checkedFollowers, setCheckedFollowers] = useState<string[]>([]);
  const handleCheck = (fullName: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedFollowers(prev => [...prev, fullName]);
    } else {
      setCheckedFollowers(prev => prev.filter((name) => name !== fullName));
    }
  }



  return (
    <div className="w-auto m-auto shadow-md p-5 bg-white rounded-md">
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
        { !isGroup &&
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
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                  />
                  <label
                    htmlFor="private"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Private
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="almost"
                    name="status"
                    type="radio"
                    value="almost"
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                  />
                  <label
                    htmlFor="almost"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Almost private
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="public"
                    name="status"
                    type="radio"
                    value="public"
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                    aria-describedby="status-error"
                  />
                  <label
                    htmlFor="public"
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
        }
        {privacy === "almost" && (
          <div className="text-sm">
            <h2>Select who can see this post:</h2>
            <div className="flex flex-start w-full bg-white h-50 ">
              {followers?.map((follower: any, index: number) => {
                const fullName = `${follower.firstName} ${follower.lastName}`;
                const id = index.toString();
                return (
                  <div key={id} className="flex flex-col items-center">
                    
                    <label
                      htmlFor={id}
                      className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                      <div className="flex flex-col justify-center align-middle text-center p-1">
                        <Image
                          className="w-10 h-10 rounded-full m-auto"
                          src={`${CADDY_URL}/avatar?id=${follower.uuid}`}
                          alt={fullName}
                          width={40}
                          height={40}
                        />
                        <span>
                          {fullName}
                        </span>
                      </div>
                    </label>
                    <input
                      type="checkbox"
                      id={id}
                      name={fullName}
                      value={fullName}
                      className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                      onChange={(e) => handleCheck(fullName, e.target.checked)}
                    />
                  </div>
                );
              })}
              <input name="authorized" type="hidden" value={checkedFollowers.join(',')} />
            </div>
          </div>
        )}
        <CreateButton />
      </form>
    </div>
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
