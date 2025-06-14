import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../../server/prisma/prisma";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { Role } from "@prisma/client";

const googleProviderOptions = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      role: profile.role ? profile.role : "user",
      phoneNumber: "",
    };
  },
});

const facebookProviderOptions = FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID!,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture?.data?.url,
      role: profile.role ? profile.role : "user",
      phoneNumber: "",
    };
  },
});

console.log({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
});
const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [googleProviderOptions, facebookProviderOptions],
  callbacks: {
    async jwt({ token, user }): Promise<any> {
      // On fusionne les infos utilisateur dans le token, mais on s'assure que les champs obligatoires ne sont jamais null
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name!,
          email: user.email!,
          image: user.image!,
          // Certains champs comme createdAt, updatedAt, emailVerified et role ne sont pas toujours présents sur l'objet user (par exemple lors de la première connexion avec un provider OAuth).
          // On va donc vérifier leur existence avant de les ajouter au token.
          ...(user && "createdAt" in user ? { createdAt: (user as any).createdAt } : {}),
          ...(user && "updatedAt" in user ? { updatedAt: (user as any).updatedAt } : {}),
          ...(user && "emailVerified" in user
            ? { emailVerified: (user as any).emailVerified ?? null }
            : { emailVerified: null }),
          ...(user && "role" in user ? { role: (user as any).role ?? "user" } : { role: "user" }),
          ...(user && "phoneNumber" in user && user.phoneNumber
            ? { phoneNumber: user.phoneNumber }
            : { phoneNumber: "" }),
        };
      }
      // Si pas de nouvel utilisateur, on garde le token tel quel
      return token;
    },
    async session({ session, token }) {
      // On s'assure que session.user existe et on copie les champs du token
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.role = token.role as Role;
        session.user.phoneNumber = token.phoneNumber as string;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
