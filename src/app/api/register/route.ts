import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../helpers/enums/HttpStatusEnum";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";
import { formatZodErrors } from "../helpers/methods/formatZodErros";
//import { WelcomeEmailTemplate } from "../../../components/welcome-template";
//import { Resend } from "resend";
//import * as React from "react";
//import { getLang } from "../helpers/methods/getLang";

const prisma = new PrismaClient();
//const resend = new Resend(process.env.RESEND_API_KEY);

const registerSchema = z.object({
  name: z.string().min(1, { message: "required_name" }),
  email: z.string().email({ message: "invalid_email" }),
  password: z.string().min(6, { message: "min_password_6_chars" }),
  //lang: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dto = {
      name: body.name?.trim(),
      email: body.email?.trim(),
      password: body.password?.trim(),
      //lang: body.lang?.trim(),
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

    // try {
    //   await resend.emails.send({
    //     from: "SnipplyURL <no-reply@snipplyurl.com.br>",
    //     to: [dto.email],
    //     subject: "Bem vindo",
    //     react: EmailTemplate({
    //       firstName: dto.name,
    //       lang: getLang(dto.lang),
    //     }) as React.ReactElement,
    //     replyTo: "snipplyurl@gmail.com",
    //   });
    // } catch (emailErr) {}

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
