import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "password_required" })
    .regex(/[A-Za-z]/, { message: "required_one_alphabetical_caracter" })
    .regex(/[0-9]/, { message: "required_one_number" })
    .refine((val) => !/\s/.test(val), {
      message: "required_password_without_empty_spaces",
    }),
  currentPassword: z
    .string()
    .min(6, { message: "password_required" })
    .regex(/[A-Za-z]/, { message: "required_one_alphabetical_caracter" })
    .regex(/[0-9]/, { message: "required_one_number" })
    .refine((val) => !/\s/.test(val), {
      message: "required_password_without_empty_spaces",
    }),
});

const changePasswordWithoutCurrentPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "password_required" })
    .regex(/[A-Za-z]/, { message: "required_one_alphabetical_caracter" })
    .regex(/[0-9]/, { message: "required_one_number" })
    .refine((val) => !/\s/.test(val), {
      message: "required_password_without_empty_spaces",
    }),
});
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email?.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "user_not_found" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    const body = await req.json();

    let dto: { newPassword: string; currentPassword?: string } = {
      newPassword: body.newPassword?.trim(),
    };

    if (user.password) {
      dto.currentPassword = body.currentPassword?.trim();
    }

    const result = user.password
      ? changePasswordSchema.safeParse(dto)
      : changePasswordWithoutCurrentPasswordSchema.safeParse(dto);

    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    // se ele criar conta via google, ele ainda não vai ter senha caso queira trocar a senha.
    if (user.password) {
      if (!dto.currentPassword) {
        return NextResponse.json(
          { message: "required_current_password" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }

      const isValidPassword = compareSync(dto.currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: "invalid_current_password" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }

      const newPasswordIsTheSameCurrentPassword = compareSync(
        dto.newPassword,
        user.password
      );
      if (newPasswordIsTheSameCurrentPassword) {
        return NextResponse.json(
          { message: "new_password_is_the_same_old_password" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }
    }

    const salt = genSaltSync(10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashSync(dto.newPassword, salt),
      },
    });

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|change-password" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
