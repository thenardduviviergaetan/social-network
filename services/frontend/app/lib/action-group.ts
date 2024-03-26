"use server";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fetchUser } from "./data";
import { CADDY_URL } from "./constants";
import { redirect } from "next/navigation";

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
};

export async function createGroup(
  prevState: State | undefined,
  formData: FormData,
) {
  const user = await fetchUser();
  const validatedData = groupFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedData.success) {
    const state: State = {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid form",
    };
    return state;
  }

  const groupData = {
    name: validatedData.data.name,
    description: validatedData.data.description,
  };

  try {
    const res = await axios.post(
      `${CADDY_URL}/groups/create?UUID=${user?.uuid}`,
      groupData,
    );
  } catch (error) {
    if (
      (error as AxiosError).response &&
      (error as AxiosError).response?.status === 500
    ) {
      const state: State = {
        errors: { name: ["Name already exists"] },
        message: "Name already exists",
      };
      return state;
    }
  }
  revalidatePath("/dashboard/groups?type=all");
  redirect("/dashboard/groups?type=all");
}

export async function joinGroup(user: string | undefined, group: string) {
  try {
    const res = await axios.post(
      `${CADDY_URL}/group/join`,
      {
        user,
        group,
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const inviteToGroup = async (
  target: string,
  group: number,
  sender: string,
) => {
  console.log(`${sender} inviting ${target} to group ${group}`);
  try {
    const res = await axios.post(
      `${CADDY_URL}/group/invite`,
      {
        target: target,
        group: group,
        sender: sender,
      },
    );
  } catch (error) {
    console.error(error);
  }
};
