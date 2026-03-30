import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          tier: user.tier,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-ins, upsert the user into our DB
      if (account?.provider === "google" && user.email) {
        try {
          const existing = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existing) {
            await prisma.user.create({
              data: {
                name: user.name ?? user.email.split("@")[0],
                email: user.email,
                image: user.image ?? null,
                role: "BUYER",
              },
            });
          } else if (user.image && existing.image !== user.image) {
            await prisma.user.update({
              where: { email: user.email },
              data: { image: user.image },
            });
          }
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.tier = (user as { tier?: string }).tier;
      }
      // For Google sign-ins, fetch role/tier from DB (not on user object)
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, tier: true },
          });
          if (dbUser) {
            token.sub = dbUser.id;
            token.role = dbUser.role;
            token.tier = dbUser.tier;
          }
        } catch {
          // keep existing token values
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { tier: string }).tier = token.tier as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
});
