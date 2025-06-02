import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;

  if (!isAuth) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.searchParams.set("error", "unauthorized");

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
