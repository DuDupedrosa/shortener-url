import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Passpord", type: "password" },
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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // ou 'database' se usar Prisma Adapter
    maxAge: 24 * 60 * 60, //24 horas (em segundos)
    updateAge: 24 * 60 * 60, // A cada 24h ele atualiza o token se o user estiver ativo
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
      // Verifica se o user já existe
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
        }
      }
    },
  },
});

// Exporta handler para cada método HTTP que o NextAuth usa
export { handler as GET, handler as POST };
