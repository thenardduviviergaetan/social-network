"use client"

import { useFormState, useFormStatus } from "react-dom";
import { createGroup } from "@/app/lib/action-group";
import { Button } from "../button";

export default function GroupForm({ func }: {func?: any}) {
  const initialState = { message: null, errors: {} };
  const [state, setFormState] = useFormState(createGroup, initialState);

  const sendForm = (f: any) => {
    setFormState(f)
    func()
  }

  return (
    <form action={sendForm}
      className="space-y-3 grid place-items-center h-auto mt-4"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-xl">
        <label htmlFor="groupName">Groupe Name*</label>
        <div className="relative">
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            type="text" name="name" id="groupName" />
        </div>
        {/* <div id="email-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div> */}
        <label htmlFor="groupDescription">Description*</label>
        <div className="relative">
          <input 
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            type="text" name="description" id="groupeDescription"/>
        </div>
          <CreateGroupButton/>
        {/* <button type="submit" value="Create New Groupe"></button> */}
      </div>
    </form>
)}


function CreateGroupButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4" aria-disabled={pending}>
      Create Group
    </Button>
  );
}