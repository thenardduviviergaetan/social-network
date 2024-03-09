import type { NextAuthConfig } from "next-auth";
import { signIn } from "next-auth/react";

/**
 * Configuration object for authentication.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks:{
    authorized({ auth, request: {nextUrl}}){
        const isLoggedIn = !!auth?.user;
        const isOnHomePage = nextUrl.pathname.startsWith("/home");
        if (isOnHomePage){
            if (isLoggedIn){
                return true;
            }
            return false;
        } else if (isLoggedIn){
            return Response.redirect(new URL('/home', nextUrl));
        }
        return true
    }
  },
  providers: [],
} satisfies NextAuthConfig;
