import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const groupFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().refine(value => value.trim() !== "", {
        message: "The groupe rquires a description"
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

    try {
        const res = await axios.post(
            "http://localhost:8000/api/group/create",
            groupData,
        );

        // revalidatePath("/group/create");
        // redirect("dashboard/group");
    } catch (error) {
        console.log("Error during POST", error );
        const state: State = {
            message: "Failed to create the groupe",
        };
        return state;
    }
}