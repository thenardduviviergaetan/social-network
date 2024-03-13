"use server";
import { auth } from "@/auth";
import axios from "axios";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  authorID: z.string(),
  author: z.string(),
  content: z.string().refine((value) => value.trim() !== "", {
    message: "Content is required",
  }),
  image: z.string().optional(),
  status: z.enum(["public", "private"], {
    invalid_type_error: "Please select an post status.",
  }),
  date: z.string(),
});

const CreatePost = FormSchema.omit({
  authorID: true,
  author: true,
  date: true,
});

export type State = {
  errors?: {
    content?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createPost(
  prevState: State | undefined,
  formData: FormData,
) {
  const imageFile = formData.get("image") as File;

  const validatedData = CreatePost.safeParse({
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid form",
    };
  }

  const session = await auth();

  const { content, image, status } = validatedData.data;
  const author_id = session?.user?.uuid;
  const author = session?.user?.name;
  const date = new Date().toISOString().split("T")[0];

  const post = {
    author_id,
    author,
    content,
    status,
    date,
    image: await uploadImage(imageFile),
  };
  try {
    const res = await axios.post("http://caddy:8000/api/posts/create", post);
  } catch (error) {
    console.error(error);
    return { message: "Failed to create post" };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

async function uploadImage(image: File | null) {
  if (!image) {
    return null;
  }
  const formData = new FormData();
  formData.append("image", image);
  try {
    const res = await axios.post(
      "http://caddy:8000/api/posts/upload-image",
      formData,
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}