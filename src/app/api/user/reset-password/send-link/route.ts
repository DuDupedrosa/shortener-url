import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import SendResetPasswordTemplate from "@/components/resend-templates/send-reset-password-link";
import { LanguageTextEnum } from "@/helper/enums/LanguageEnum";
import { nanoid } from "nanoid";
import { formatZodErrors } from "@/app/api/helpers/methods/formatZodErros";
import { HttpStatusEnum } from "@/app/api/helpers/enums/HttpStatusEnum";

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  lang: z.string().min(1, { message: "lang_not_null_or_empty" }),
  appBaseUrl: z.string().min(1, { message: "app_base_url_not_null_or_empty" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      email: body.email?.trim(),
      lang: body.lang?.trim(),
      appBaseUrl: body.appBaseUrl?.trim(),
    };

    const result = registerSchema.safeParse(dto);
    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const resetPasswordId = nanoid(32);

    try {
      const from = process.env.RESEND_FROM;
      const replyTo = process.env.RESEND_REPLY_TO;

      if (from && replyTo) {
        await resend.emails.send({
          from,
          to: [dto.email],
          subject:
            dto.lang === LanguageTextEnum.EN
              ? "Reset Password"
              : "Redefinição de senha",
          react: SendResetPasswordTemplate({
            resetLink: `${dto.appBaseUrl}/auth/reset-password/${resetPasswordId}`,
            lang: dto.lang ?? LanguageTextEnum.PT,
          }) as React.ReactElement,
          replyTo,
        });
      }
    } catch (emailErr) {
      return NextResponse.json(
        { message: "error_send_email_with_link_to_reset_password" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    await prisma.resetPassword.create({
      data: {
        code: resetPasswordId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expira em 10 minutos
        email: dto.email,
      },
    });

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|reset-password|send-link" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
