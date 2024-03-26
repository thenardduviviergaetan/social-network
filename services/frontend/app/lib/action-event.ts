"use server"
import axios, { AxiosError } from "axios";
import { CADDY_URL } from "./constants";
import { z } from "zod";
import { fetchUser } from "./data";

const eventFormSchema = z.object({
    date: z.string().refine((value) => value.trim() !== "", {
        message: "Date of event is required",
    }),
    name: z.string().min(10, "Name must be at least 10 characters long."),
    description: z.string().refine(content => content.trim() !== "", {
        message: "The Event must have a description."
    })
})

export type State = {
    errors?: {
        date?: string[];
        name?: string[];
        description?: string[];
    };
    message?: string | null;
}

export const createEventRequest = async (prevState: State | undefined, formData: FormData,group_id:number) => {
    const user = await fetchUser();
    const validatedData = eventFormSchema.safeParse({
        date:formData.get("event_date"),
        name:formData.get("event_name"),
        description:formData.get("event_desc")
    });
    if(!validatedData.success) {
        const state:State = {
            errors:validatedData.error.flatten().fieldErrors,
            message:"invalidForm",
        }
        console.log(state.errors)
        return state
    }

    const eventData = {
        date: validatedData.data.date,
        name: validatedData.data.name,
        description: validatedData.data.description,
        creator_id:user?.uuid,
        group_id:group_id
    };
    try {
        const res = await axios.post(
            `${CADDY_URL}/group/event/create`,
                eventData
        );

        return res.data;
    } catch (error) {
        if ((error as AxiosError).response && (error as AxiosError).response?.status === 409) {
            const state: State = {
              errors: { name: ["This event name already exist"] },
              message: "This event name already exist",
            };
            return state;
          }
          throw error;
        }
    }


