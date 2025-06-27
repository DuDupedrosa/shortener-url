import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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

    return NextResponse.json(
      { payload: user.password ? true : false },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|has-password" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
