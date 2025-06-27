import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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
    const avatarUrl = body.avatarUrl?.trim();

    if (!avatarUrl || typeof avatarUrl !== "string" || avatarUrl.length <= 0) {
      return NextResponse.json(
        { message: "required_avatar_url" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email?.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "not_found_user" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        image: avatarUrl,
      },
    });

    const { password, otpCode, otpCodeExpiresAt, ...response } = updatedUser;

    return NextResponse.json(
      { payload: response },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|undo-change-avatar" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
