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
        const isOnMainPage = nextUrl.pathname === "/";
        const isOnLoginPage = nextUrl.pathname.startsWith("/login");
        const isOnRegisterPage = nextUrl.pathname.startsWith("/register");
        const isOnAllowedPages = isOnLoginPage || isOnRegisterPage || isOnMainPage;
        if (isOnAllowedPages){
            if (!isLoggedIn){
                return true;
            }
            return Response.redirect(new URL('/dashboard', nextUrl));
        } else if (isLoggedIn){
          return true;
        }
        return Response.redirect(new URL('/login', nextUrl));
    }
  },
  providers: [],
} satisfies NextAuthConfig;
