"use server"
import { auth } from "@/auth";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fetchUser } from "./data";
import { CADDY_URL } from "./constants";

const groupFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().refine(value => value.trim() !== "", {
        message: "The group requires a description"
    })
})

export type State = {
    errors?: {
        name?: string[];
        description?: string[];
    };
    message?: string | null;
}

export async function createGroup(prevState: State | undefined, formData: FormData){
    const user =await fetchUser();
    const validatedData = groupFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    })

    if (!validatedData.success) {
        const state: State = {
            errors:  validatedData.error.flatten().fieldErrors,
            message: "Invalid form",
        }
        return state
    }

    const groupData = {
        name: validatedData.data.name,
        description: validatedData.data.description,
    };

    console.log('UUID',user?.uuid)
    try {
        const res = await axios.post(
            `http://caddy:8000/api/groups/create?UUID=${user?.uuid}`,
            groupData,
        );

        revalidatePath("/groups/create");
        // redirect("/dashboard/group");
    } catch (error) {
        console.log("Error during POST", error );
        const state: State = {
            message: "Failed to create the groupe",
        };
        return state;
    }
}


export const joinGroupRequestFetch = async (id: number, owner: string) => {
    const user = await fetchUser();
    try {
        const res = await axios.get(`${CADDY_URL}/group/join?group=${id}&user=${user?.uuid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}


