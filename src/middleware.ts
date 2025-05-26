import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth",
  },
});

// Rotas que o middleware deve proteger
export const config = { matcher: ["/dashboard/:path*"] };
