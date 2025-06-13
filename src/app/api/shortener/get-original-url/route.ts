import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const label = searchParams.get("label");

    if (!label?.trim()) {
      return NextResponse.json(
        { message: "label_must_be_valid_string" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const shortener = await prisma.shortener.findUnique({
      where: { label: label },
    });

    if (!shortener) {
      return NextResponse.json(
        { message: "not_found_shortener" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    return NextResponse.json(
      { payload: shortener.originalUrl },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|shortener|get-original-url" },
      { status: HttpStatusEnum.SERVICE_UNAVAILABLE }
    );
  }
}
