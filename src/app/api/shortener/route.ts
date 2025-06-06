import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import z from "zod";
import { formatZodErrors } from "../helpers/methods/formatZodErros";
import validator from "validator";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const registerSchema = z.object({
  url: z.string().min(1, { message: "required_url" }),
  label: z.string().optional(),
  randomLabel: z.boolean(),
});

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
    if (!body) {
      return NextResponse.json(
        { message: "required_body" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const dto = {
      url: body.url?.trim(),
      label: body.label?.trim().toLowerCase(),
      randomLabel: body.randomLabel,
    };

    const result = registerSchema.safeParse(dto);
    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (!validator.isURL(dto.url, { require_protocol: false })) {
      return NextResponse.json(
        { message: "invalid_url" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (dto.url.toLowerCase().startsWith("http://")) {
      return NextResponse.json(
        { message: "http_not_valid_protocol" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (!dto.randomLabel) {
      if (!dto.label || dto.label.length <= 0) {
        return NextResponse.json(
          { message: "required_link_label" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }

      if (await prisma.shortener.findUnique({ where: { label: dto.label } })) {
        return NextResponse.json(
          { message: "label_already_register" },
          { status: HttpStatusEnum.BAD_REQUEST }
        );
      }
    } else {
      let randomLabel = nanoid(3);
      let labelAlreadyRegister = await prisma.shortener.findUnique({
        where: { label: randomLabel },
      });

      while (labelAlreadyRegister) {
        let newRandomLabel = nanoid(3);
        randomLabel = newRandomLabel;
        labelAlreadyRegister = await prisma.shortener.findUnique({
          where: { label: newRandomLabel },
        });
      }
      dto.label = randomLabel;
    }

    if (!validator.isURL(dto.url, { require_protocol: true })) {
      dto.url = `https://${dto.url}`;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email?.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "required_user_session" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const createdShortener = await prisma.shortener.create({
      data: {
        originalUrl: dto.url,
        label: dto.label,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { payload: { id: createdShortener.id } },
      { status: HttpStatusEnum.CREATED }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|shortener|create" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
