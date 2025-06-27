import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { formatZodErrors } from "../../helpers/methods/formatZodErros";

const prisma = new PrismaClient();

const updateSchema = z.object({
  name: z.string().min(1, { message: "name_not_null_or_empty" }),
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

    const body = await req.json();

    const dto = {
      name: body.name?.trim(),
    };

    const result = updateSchema.safeParse(dto);

    if (!result.success) {
      const error = formatZodErrors(result.error);
      return NextResponse.json(
        { message: "invalid_data", error },
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
        name: dto.name,
      },
    });

    const { password, otpCode, otpCodeExpiresAt, ...response } = updatedUser;

    return NextResponse.json(
      { payload: response },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|update-basic-data" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
