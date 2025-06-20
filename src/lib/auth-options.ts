import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { Resend } from "resend";
import WelcomeEmailTemplate from "@/components/resend-templates/welcome-template";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("required_credentials_data");
        }

        if (!credentials.email || !credentials.password) {
          throw new Error("required_email_and_password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim() },
        });

        if (!user) {
          throw new Error("user_not_register");
        }

        if (!user.password) {
          throw new Error("user_not_registered_by_credentials");
        }

        const isValid = await compare(
          credentials.password.trim(),
          user.password
        );

        if (!isValid) {
          throw new Error("invalid_password");
        }

        if (!user.otpEnable) {
          throw new Error("required_otp");
        }

        const { password, ...rest } = user;
        return rest;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
              otpEnable: true,
            },
          });

          try {
            const from = process.env.RESEND_FROM;
            const replyTo = process.env.RESEND_REPLY_TO;

            if (from && replyTo) {
              await resend.emails.send({
                from,
                to: [user.email],
                subject: "Bem vindo",
                react: WelcomeEmailTemplate({
                  firstName: user.name ?? user.email,
                  lang: "pt",
                }) as React.ReactElement,
                replyTo,
              });
            }
          } catch (emailErr) {}
        }

        if (dbUser && !dbUser.image) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { image: user.image },
          });
        }
      }
    },
  },
};
