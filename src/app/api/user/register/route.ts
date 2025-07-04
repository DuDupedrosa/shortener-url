import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(1, { message: "required_name" }),
  email: z.string().email({ message: "invalid_email" }),
  password: z
    .string()
    .min(6, { message: "password_required" })
    .regex(/[A-Za-z]/, { message: "required_one_alphabetical_caracter" })
    .regex(/[0-9]/, { message: "required_one_number" })
    .refine((val) => !/\s/.test(val), {
      message: "required_password_without_empty_spaces",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      name: body.name?.trim(),
      email: body.email?.trim(),
      password: body.password?.trim(),
    };

    const result = registerSchema.safeParse(dto);

    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user && user.password) {
      return NextResponse.json(
        { message: "user_already_registered" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (user && !user.password) {
      return NextResponse.json(
        { message: "user_not_registered_by_credentials" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const salt = genSaltSync(10);
    await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashSync(dto.password, salt),
      },
    });

    return NextResponse.json(
      { payload: null },
      { status: HttpStatusEnum.CREATED }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|register" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
