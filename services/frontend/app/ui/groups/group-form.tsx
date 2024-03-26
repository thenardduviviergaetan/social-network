"use client"

import { useFormState, useFormStatus } from "react-dom";
import { createGroup } from "@/app/lib/action-group";
import { Button } from "@/app/ui/button";

export default function GroupForm() {
  const initialState = { message: "", errors: {} };
  const [state, setState] = useFormState(createGroup, initialState);
  
  return (
    <>
      <form
        action={setState}
        className="space-y-3 grid items-center h-auto mt-4"
      >
        <h3 className="text-xl font-bold mb-4">Create a new group</h3>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-xl">
          <label htmlFor="groupName">Group Name*</label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] p-2 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              name="name"
              id="groupName"
            />
          </div>
          <div
            id="name-error"
            aria-live="polite"
            aria-atomic="true"
            className="mt-2 text-sm text-red-500"
          >
            {state?.errors?.name &&
              state?.errors.name.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
          </div>
          <label htmlFor="groupDescription">Description*</label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] p-2 text-sm outline-2 placeholder:text-gray-500"
              type="text"
              name="description"
              id="groupDescription"
            />
          </div>
          <div
            id="description-error"
            aria-live="polite"


            aria-atomic="true"
            className="mt-2 text-sm text-red-500"
          >
            {state?.errors?.description &&
              state?.errors.description.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
          </div>
          <CreateGroupButton />
        </div>
      </form>
    </>
  );}
function CreateGroupButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4" aria-disabled={pending}>
      Create Group
    </Button>
  );
}