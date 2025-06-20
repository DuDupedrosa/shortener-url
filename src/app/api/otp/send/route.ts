import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import z from "zod";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { Resend } from "resend";
import { SendOtpCodeTemplate } from "@/components/resend-templates/send-otp-code-template";
import { customAlphabet } from "nanoid";
import { LanguageTextEnum } from "@/helper/enums/LanguageEnum";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const nanoIdAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const registerSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "min_password_6_chars" }),
  lang: z.string().min(1, { message: "lang_not_null_or_empty" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      email: body.email?.trim(),
      password: body.password?.trim(),
      lang: body.lang?.trim(),
    };

    const result = registerSchema.safeParse(dto);

    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      return NextResponse.json(
        { message: "user_not_found" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "user_not_registered_by_credentials" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const isValidPassword = await compare(dto.password.trim(), user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "invalid_password" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    // só gera um nanoid com alphabet somente letras e números
    const nanoid = customAlphabet(nanoIdAlphabet, 4);
    const otpId = nanoid();

    try {
      const from = process.env.RESEND_FROM;
      const replyTo = process.env.RESEND_REPLY_TO;

      if (from && replyTo) {
        await resend.emails.send({
          from,
          to: [dto.email],
          subject:
            dto.lang === LanguageTextEnum.EN
              ? "Access Code"
              : "Código de acesso",
          react: SendOtpCodeTemplate({
            firstName: user.name ?? dto.email,
            lang: dto.lang,
            code: otpId,
          }) as React.ReactElement,
          replyTo,
        });
      }
    } catch (emailErr) {
      return NextResponse.json(
        { message: "internal_server_erro|api|otp|send|Resend" },
        { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otpId,
        otpCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos a frente da data atual
      },
    });

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|otp|send" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
