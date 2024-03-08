"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const registerFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmation: z.string().min(6),
  firstName: z.string().refine((value) => value.trim() !== "", {
    message: "First name is required",
  }),
  lastName: z.string().refine((value) => value.trim() !== "", {
    message: "Last name is required",
  }),
  dateOfBirth: z.string().refine((value) => value.trim() !== "", {
    message: "Date of birth is required",
  }),
  nickname: z.string().optional(),
  about: z.string().optional(),
  avatar: z.custom((v) => v instanceof File && v.size < 20000, {
    message: "Invalid file or file size too large",
  }).optional(),
}).refine((data) => data.password === data.confirmation, {
  message: "Passwords do not match",
  path: ["confirmation"],
})

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmation?: string[];
    firstName?: string[];
    lastName?: string[];
    dateOfBirth?: string[];
    nickname?: string[];
    about?: string[];
    avatar?: string[];
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
    confirmation: formData.get("confirmation"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    nickname: formData.get("nickname"),
    about: formData.get("about"),
    avatar: formData.get("avatar"),
  });

  if (!validatedData.success) {
    const state: State = {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid form",
    };
    return state;
  }

  const uuid = uuidv4();

  if ((validatedData.data.avatar as File).size > 0) {
    const f = new FormData();
    f.append("uuid", uuid);
    f.append("avatar", validatedData.data.avatar as Blob);
    try {
      const upload = await axios.post(
        "http://caddy:8000/api/upload",
        f,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("file uploaded successfully");
    } catch (error) {
      const state: State = {
        errors: { avatar: ["Failed to upload avatar"] },
        message: "Failed to upload avatar",
      };
      return state;
    }
  }

  const userData = {
    uuid: uuid,
    email: validatedData.data.email,
    password: validatedData.data.password,
    firstName: validatedData.data.firstName,
    lastName: validatedData.data.lastName,
    dateOfBirth: validatedData.data.dateOfBirth,
    nickname: validatedData.data.nickname,
    about: validatedData.data.about,
  };

  console.log("submitting form ", userData);
  try {
    const res = await axios.post(
      "http://caddy:8000/api/register",
      userData,
    );

    console.log("form submitted successfully");
    revalidatePath("/login");
    redirect("/login");
  } catch (error) {
    throw error;
  }
}
