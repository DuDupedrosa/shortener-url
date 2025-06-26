import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import z from "zod";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";
import { PrismaClient } from "@prisma/client";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const registerSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "password_required" })
    .regex(/[A-Za-z]/, { message: "required_one_alphabetical_caracter" })
    .regex(/[0-9]/, { message: "required_one_number" })
    .refine((val) => !/\s/.test(val), {
      message: "required_password_without_empty_spaces",
    }),
  code: z.string().min(1, { message: "code_required" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      newPassword: body.newPassword?.trim(),
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

    const data = await prisma.resetPassword.findUnique({
      where: { code: dto.code },
    });

    if (!data) {
      return NextResponse.json(
        { message: "code_not_found" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    if (new Date() > new Date(data.expiresAt)) {
      return NextResponse.json(
        { message: "password_link_expired" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      return NextResponse.json(
        { message: "user_not_found_or_register" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    // pode vir via google sem senha (ou seja, vai definir a primeira senha pelo reset)
    if (user.password) {
      if (compareSync(dto.newPassword, user.password)) {
        return NextResponse.json(
          { message: "new_password_is_the_same_old_password" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }
    }

    const salt = genSaltSync(10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashSync(dto.newPassword, salt) },
    });

    try {
      await prisma.resetPassword.deleteMany({ where: { email: data.email } });
    } catch (err) {}

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|reset-password" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
