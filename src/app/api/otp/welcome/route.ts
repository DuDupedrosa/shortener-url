import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Resend } from "resend";
import { LanguageTextEnum } from "@/helper/enums/LanguageEnum";
import WelcomeEmailTemplate from "@/components/resend-templates/welcome-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const lang = body.lang?.trim();

    if (session && session.user.email) {
      try {
        const from = process.env.RESEND_FROM;
        const replyTo = process.env.RESEND_REPLY_TO;

        if (from && replyTo) {
          await resend.emails.send({
            from,
            to: [session.user.email.trim()],
            subject: lang === LanguageTextEnum.EN ? "Welcome" : "Bem vindo",
            react: WelcomeEmailTemplate({
              firstName: session.user.name ?? session.user.email,
              lang: lang ?? LanguageTextEnum.PT,
            }) as React.ReactElement,
            replyTo,
          });
        }
      } catch (emailErr) {}
    }

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|otp|welcome" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
