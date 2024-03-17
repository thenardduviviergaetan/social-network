"use server";
import { auth } from "@/auth";
import axios from "axios";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const PostFormSchema = z.object({
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
const CommentFormSchema = z.object({
  authorID: z.string(),
  author: z.string(),
  postID: z.string(),
  content: z.string().refine((value) => value.trim() !== "", {
    message: "Content is required",
  }),
  image: z.string().optional(),
  date: z.string(),
});

const CreatePost = PostFormSchema.omit({
  authorID: true,
  author: true,
  date: true,
});

const CreateComment = CommentFormSchema.omit({
  authorID: true,
  author: true,
  postID: true,
  date: true,
});


export type State = {
  errors?: {
    content?: string[];
    status?: string[];
  };
  message?: string | null;
};

/**
 * Uploads an image to the server.
 * @param image - The image file to upload.
 * @param path - The path where the image should be stored on the server.
 * @returns A Promise that resolves to the response data from the server, or null if an error occurs.
 */
async function uploadImage(image: File | null, path: string) {
  if (!image) {
    return null;
  }
  const formData = new FormData();
  formData.append("image", image);
  formData.append("path", path);
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

/**
 * Creates a new post.
 * 
 * @param prevState - The previous state of the application.
 * @param formData - The form data containing the post content and status.
 * @returns An object with the created post data or error information.
 */
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
    image: await uploadImage(imageFile, "posts"),
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

/**
 * Creates a comment.
 * 
 * @param prevState - The previous state.
 * @param formData - The form data containing the comment content and image.
 * @returns An object with the comment errors and message if the form data is invalid, or a message if the comment creation fails.
 */
export async function createComment(
  prevState: State | undefined,
  formData: FormData,
) {
  const imageFile = formData.get("image") as File;

  const validatedData = CreateComment.safeParse({
    content: formData.get("content"),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Invalid form",
    };
  }

  const session = await auth();

  const { content, image } = validatedData.data;
  const author_id = session?.user?.uuid;
  const author = session?.user?.name;
  const post_id = formData.get("postID");
  const date = new Date().toISOString().split("T")[0];

  const comment = {
    author_id,
    author,
    post_id: Number(post_id),
    content,
    date,
    image: await uploadImage(imageFile, "comments"),
  };
  
  try {
    const res = await axios.post(
      "http://caddy:8000/api/comments/create",
      comment,
    );
  } catch (error) {
    console.error(error);
    return { message: "Failed to create comment" };
  }
  revalidatePath(`dashboard/posts?id=${post_id}`);
  redirect(`/dashboard/posts?id=${post_id}`);
}


export async function followUser(user: string, authorID: string) {
  try {
    const res = await axios.post(
      `http://caddy:8000/api/user/follow`,
      {
        user : authorID,
        follower: user,
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
}