import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Send user data to your backend for authentication/registration
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_SPLITEASE_BACKEND_URL ||
              "http://localhost:4000"
            }/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: user.id,
                picture: user.image,
              }),
            }
          );

          if (response.ok) {
            const authData = await response.json();
            // Store the backend token for later use
            user.backendToken = authData.token;
            user.backendUser = authData.user;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Store backend token and user data in JWT
      if (user?.backendToken) {
        token.backendToken = user.backendToken;
        token.backendUser = user.backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Send backend token and user data to the client
      if (token.backendToken) {
        session.backendToken = token.backendToken as string;
        session.backendUser = token.backendUser;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
};
