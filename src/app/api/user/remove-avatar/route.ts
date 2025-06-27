import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
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
        { message: "not_found_user" },
        { status: HttpStatusEnum.NOT_FOUND }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        image: null,
      },
    });

    const { password, otpCode, otpCodeExpiresAt, ...response } = updatedUser;

    return NextResponse.json(
      { payload: response },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|remove-avatar" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
