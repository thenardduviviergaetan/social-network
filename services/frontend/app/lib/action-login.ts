'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

/**
 * Authenticates the user with the provided form data.
 * 
 * @param prevState - The previous state (optional).
 * @param formData - The form data containing the user's credentials.
 * @returns A promise that resolves when the authentication is successful.
 * @throws An error if the authentication fails.
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
