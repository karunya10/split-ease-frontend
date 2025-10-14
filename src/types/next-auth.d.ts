import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    backendToken?: string;
    backendUser?: {
      id: string;
      email: string;
      name?: string;
    };
  }

  interface User extends DefaultUser {
    backendToken?: string;
    backendUser?: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    backendUser?: {
      id: string;
      email: string;
      name?: string;
    };
  }
}
