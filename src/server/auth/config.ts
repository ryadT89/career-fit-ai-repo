import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      userType: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    GitHubProvider,
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      async authorize(credentials, _): Promise<{ id: string, email: string; type: string }> {
        const {email, password} = credentials as {email: string, password: string};
        
        const existingUser = await db.user.findUnique({
          where: { email },
        });

        if(existingUser) {
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          console.log(isPasswordValid);
          if (isPasswordValid) {
            return {id: existingUser.id, email: existingUser.email, type: existingUser.userType || ''};
          }
        }

        throw new Error("Invalid email or password");
      }
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/signin"
  },
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        const userData = await db.user.findUnique({where: {email: session.user.email}});
        return {...session, user: {id: userData?.id, name: userData?.name, email: userData?.email, userType: userData?.userType}};
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
