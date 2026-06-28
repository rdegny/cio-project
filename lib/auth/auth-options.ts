import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Local credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const allowedEmail = process.env.AUTH_LOCAL_EMAIL?.trim().toLowerCase();
        const allowedPassword = process.env.AUTH_LOCAL_PASSWORD;

        if (!email || !password || !allowedEmail || !allowedPassword) {
          return null;
        }

        if (email !== allowedEmail || password !== allowedPassword) {
          return null;
        }

        const user = await prisma.user.upsert({
          where: { email },
          create: { email },
          update: {},
          select: {
            id: true,
            email: true,
            name: true,
            image: true
          }
        });

        await prisma.userSettings.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {}
        });

        return user;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }

      return session;
    }
  }
};
