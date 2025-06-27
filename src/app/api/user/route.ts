import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../helpers/enums/HttpStatusEnum";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { LanguageTextEnum } from "@/helper/enums/LanguageEnum";
import DeleteAccountEmailTemplate from "@/components/resend-templates/delete-account-template";

const resend = new Resend(process.env.RESEND_API_KEY);

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const lang = searchParams.get("lang");
    let email;
    let name;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email?.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "not_found_user" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    email = user.email;
    name = user.name;

    await prisma.user.delete({ where: { id: user.id } });

    if (email && name) {
      try {
        const from = process.env.RESEND_FROM;
        const replyTo = process.env.RESEND_REPLY_TO;

        if (from && replyTo) {
          await resend.emails.send({
            from,
            to: [email],
            subject:
              lang === LanguageTextEnum.EN
                ? "Account successfully deleted"
                : "Conta deletada com sucesso",
            react: DeleteAccountEmailTemplate({
              firstName: name,
              lang:
                lang === LanguageTextEnum.EN
                  ? LanguageTextEnum.EN
                  : LanguageTextEnum.PT,
            }) as React.ReactElement,
            replyTo,
          });
        }
      } catch (emailErr) {}
    }

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|delete" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
