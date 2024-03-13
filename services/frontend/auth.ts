import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import type { TokenUser } from "@/app/lib/definitions";
import axios from "axios";
import { z } from "zod";

/**
 * Authentication function that handles signing in and signing out.
 * @param credentials - The user's login credentials.
 * @returns A Promise that resolves to the user's data if authentication is successful, or null otherwise.
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
      const parsedcredentials = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }).safeParse(credentials);
      if (parsedcredentials.success) {
        const { email, password } = parsedcredentials.data;
        try {
          const res = await axios.post("http://caddy:8000/api/login", {
            email: email,
            password: password,
          });
          if (res) {
            const user = res.data as TokenUser;
            return Promise.resolve(user);
          }
        } catch (error) {
          console.log("Error in credentials");
          return null;
        }
      }
      console.log("Invalid credentials.");
      return null;
    },
  })],
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = (user as TokenUser).name
        token.uuid = (user as TokenUser).uuid;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name,
        picture: "http://caddy:8000/api/avatar?id=" + token.uuid ,
        uuid: token.uuid,
      };
      return session;
    },
  }
});
