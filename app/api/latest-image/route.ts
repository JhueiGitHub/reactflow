// app/api/latest-image/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const latestImage = await prisma.image.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestImage) {
      return NextResponse.json({ success: true, image: latestImage });
    } else {
      return NextResponse.json({ success: false, message: "No images found" });
    }
  } catch (error) {
    console.error("Error fetching latest image:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching latest image" },
      { status: 500 }
    );
  }
}
