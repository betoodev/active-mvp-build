import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_SECRET )
  throw new Error("Failed to initialize GOOGLE authentication");
  
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: '156380673473-ipevg620jqpp9m98o6cedpk6g542ftgf.apps.googleusercontent.com',
      clientSecret: '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',
          }),
          ],  

  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },

  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
  },
};

export default NextAuth(authOptions);
