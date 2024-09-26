// app/api/upload/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("POST request received");

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Save file information to database
    const image = await prisma.image.create({
      data: {
        fileName: fileName,
        url: `/uploads/${fileName}`,
      },
    });

    console.log("File uploaded successfully:", fileName);
    return NextResponse.json({ success: true, imageUrl: image.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
