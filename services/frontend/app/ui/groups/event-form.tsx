"use client"
import { GroupButtonProps } from "@/app/lib/definitions";
import { Button } from "../button";
import { useState } from "react";
import { TicketIcon, BookOpenIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { ICON_STYLE } from "@/app/lib/constants";
import { useFormState, useFormStatus } from "react-dom";
import { State, createEventRequest } from "@/app/lib/action-event";

export default function CreateEvent({ user, group }: GroupButtonProps) {

    const sendReq = (prev: State, form: FormData) => {
        return createEventRequest(prev, form, group.id);
    }

    const initialState = { message: null, errors: {}, id: group.id };

    const [state, setFormState] = useFormState(sendReq, initialState);

    const [showCreateEventState, setShowCreateEventState] = useState(false)
    return (
        <div className={"bg-white rounded-lg shadow-xl text-purple-700 mt-8 min-w-fit w-1/4 p-5 mb-5"}>
            <Button
                className="w-auto"
                onClick={() => {
                    setShowCreateEventState((prevState) => !prevState);
                }}
            >
                Create an Event for {group.name}
            </Button>
            {showCreateEventState && (
                <form
                    className="flex flex-col w-full h-full p-5 justify-around shadow-xl mt-5 text-gray-500"
                    action={setFormState}
                >
                    <label htmlFor="event_date"></label>
                    <div className="relative">
                        <input
                            type="date"
                            name="event_date"
                            placeholder="mm/dd/yyyy"
                            className="placeholder:bg-gray-500 pl-10 py-3 border rounded-md text-sm text-black w-full"
                        />
                        <CalendarDaysIcon className={ICON_STYLE} />
                    </div>
                    <label htmlFor="event_name" className="text-black p-3 hover:text-purple-700 text-sm">
                        Name of the event*
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="event_name"
                            className="peer block w-full rounded-md border border-gray-200 py-[6px] pl-10"
                            placeholder="Name of event"
                        />

                        <TicketIcon className={ICON_STYLE} />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                    <label htmlFor="event_desc" className="text-black p-3 hover:text-purple-700 text-sm">
                        Description of the event*
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="event_desc"
                            placeholder="Description"
                            className="peer block w-full rounded-md border border-gray-200 py-[6px] pl-10"
                        />

                        <BookOpenIcon className={ICON_STYLE} />
                    </div>
                    <CreateEventButton />
                </form>
            )}
        </div>
    );
}

function CreateEventButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="mt-4" aria-disabled={pending}>
            Create Event
        </Button>
    );
}