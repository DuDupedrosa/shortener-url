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
const unauthorized = "unauthorized";
const requiredBody = "required_body";
const invalidData = "invalid_data";
const invalidUrl = "invalid_url";
const httpNotValidProtocol = "http_not_valid_protocol";
const requiredValidCuid = "required_valid_cuid";
const notFoundShortener = "not_found_shortener";
const registerSchema = z.object({
  url: z.string().refine((val) => validator.isURL(val, {}), {
    message: invalidUrl,
  }),
  label: z.string().optional(),
  randomLabel: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: unauthorized },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { message: requiredBody },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    let dto = {
      url: body.url?.trim(),
      label: body.label?.trim().toLowerCase(),
      randomLabel: body.randomLabel,
    };

    const result = registerSchema.safeParse(dto);
    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: invalidData, error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (dto.url.toLowerCase().startsWith("http://")) {
      return NextResponse.json(
        { message: httpNotValidProtocol },
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

const updateSchema = z.object({
  url: z.string().refine((val) => validator.isURL(val, {}), {
    message: invalidUrl,
  }),
  id: z.string().cuid({ message: requiredValidCuid }),
});
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: unauthorized },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { message: requiredBody },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const dto = {
      url: body.url?.trim(),
      id: body.id,
    };

    const result = updateSchema.safeParse(dto);
    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: invalidData, error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const shortener = await prisma.shortener.findUnique({
      where: { id: dto.id },
      include: { user: true },
    });

    if (!shortener) {
      return NextResponse.json(
        { message: notFoundShortener },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    if (shortener.user.email !== session.user.email) {
      return NextResponse.json(
        { message: unauthorized },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    if (dto.url === shortener.originalUrl) {
      let { user, ...resp } = shortener;
      return NextResponse.json(
        { payload: resp },
        { status: HttpStatusEnum.OK }
      );
    }

    if (dto.url.toLowerCase().startsWith("http://")) {
      return NextResponse.json(
        { message: httpNotValidProtocol },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (!validator.isURL(dto.url, { require_protocol: true })) {
      dto.url = `https://${dto.url}`;
    }

    const updatedShortener = await prisma.shortener.update({
      where: { id: shortener.id },
      data: {
        originalUrl: dto.url,
      },
    });

    return NextResponse.json(
      { payload: updatedShortener },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|shortener|update" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}

const deleteSchema = z.object({
  id: z.string().cuid({ message: requiredValidCuid }),
});
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: unauthorized },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id");

    const dto = {
      id,
    };

    const result = deleteSchema.safeParse(dto);
    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: invalidData, error },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: "id_not_null_or_empty" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const shortener = await prisma.shortener.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!shortener) {
      return NextResponse.json(
        { message: notFoundShortener },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    if (shortener.user.email !== session.user.email) {
      return NextResponse.json(
        { message: unauthorized },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    await prisma.shortener.delete({ where: { id } });

    return NextResponse.json({ payload: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|shortener|delete" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
