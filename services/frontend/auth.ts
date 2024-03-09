import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { User } from "@/app/lib/definitions";
import axios from "axios";
import { z } from "zod";

// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await axios.get(`http://caddy:8000/api/login?email=${email}`);
//     return user.data;
//   } catch (error) {
//     throw new Error("Failed to fetch user.");
//   }
// }

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [Credentials({
//     async authorize(credentials) {
//       const parsedcredentials = z.object({
//         email: z.string().email(),
//         password: z.string().min(6),
//       }).safeParse(credentials);
//       if (parsedcredentials.success) {
//         const { email, password } = parsedcredentials.data;
//         // const user = await getUser(email);
//         // console.log(user);
//         // if (!user) return null;
//         // console.log("User found!");
//         // const passwordsMatch = await bcrypt.compare(password, user.password);


//         try{
//             const user = await axios.post("http://caddy:8000/api/login", {
//                 email: email,
//                 password: password
//             })
//             if (user){
//                 return user.data;
//             }
//         } catch (error) {
//           console.log("Error in credentials");
//         }
//       }
//       console.log("Invalid credentials");
//       return null;
//     },
//   })],
// });


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
            const userData = {
              uuid: res.data.uuid,
              email: res.data.email,
            };
            return Promise.resolve(userData);
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
});
