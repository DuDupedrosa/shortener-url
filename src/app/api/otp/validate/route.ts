import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import z from "zod";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "min_password_6_chars" }),
  code: z.string().min(1, { message: "code_not_null_or_empty" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      email: body.email?.trim(),
      password: body.password?.trim(),
      code: body.code?.trim(),
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

    if (
      !user.otpCodeExpiresAt ||
      new Date() > new Date(user.otpCodeExpiresAt)
    ) {
      return NextResponse.json(
        { message: "expired_code" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (user.otpCode !== dto.code) {
      return NextResponse.json(
        { message: "invalid_code" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpEnable: true,
        otpCode: null,
        otpCodeExpiresAt: null,
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
