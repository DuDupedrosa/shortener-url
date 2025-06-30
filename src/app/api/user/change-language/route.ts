import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { isValidLanguage } from "@/helper/methods/languageHelper";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const lang = body.lang?.trim();

    if (!lang) {
      return NextResponse.json(
        { message: "required_lang" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    if (!isValidLanguage(lang)) {
      return NextResponse.json(
        { message: "invalid_language" },
        { status: HttpStatusEnum.BAD_REQUEST }
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

    if (user.lang !== lang) {
      await prisma.user.update({ where: { id: user.id }, data: { lang } });
    }

    return NextResponse.json({ paylaod: null }, { status: HttpStatusEnum.OK });
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|change-language" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
