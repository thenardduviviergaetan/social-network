"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

export type State = {
  errors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  message?: string | null;
};

export async function register(
  prevState: State | undefined,
  formData: FormData,
) {
  const validatedData = registerFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthDate: formData.get("birthDate"),
  });

  if (!validatedData.success) {
    const state: State = {
      errors: {
        email: "error email",
        password: "error password",
        firstName: "error firstName",
        lastName: "error lastName",
            },
      message: "Error in form...",
    };
    return state;
  }

  try {
    const res = await axios.post(
      "http://caddy:8000/api/register",
      validatedData.data,
    );
    console.log("form submitted successfully");
    revalidatePath("/login");
    redirect("/login");
  } catch (error) {
    throw error;
  }
}
