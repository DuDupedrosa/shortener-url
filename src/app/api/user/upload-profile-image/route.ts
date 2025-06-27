export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { HttpStatusEnum } from "../../helpers/enums/HttpStatusEnum";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // precisa ser a service role para poder fazer upload
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: HttpStatusEnum.UNAUTHORIZED }
      );
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "required_avatar" },
        { status: HttpStatusEnum.BAD_REQUEST }
      );
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { message: "file_too_large" },
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

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}/${randomUUID()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("users-avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "internal_server_erro|upload_supabase_storage" },
        { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("users-avatars")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image: avatarUrl },
    });

    const { otpCode, otpCodeExpiresAt, password, ...response } = updatedUser;

    return NextResponse.json(
      { payload: response },
      { status: HttpStatusEnum.OK }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "internal_server_erro|api|user|upload-profile-image" },
      { status: HttpStatusEnum.INTERNAL_SERVER_ERROR }
    );
  }
}
