import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      tier: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    tier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    tier?: string;
  }
}
