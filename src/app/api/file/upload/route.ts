import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path, { join } from "path";

// File upload handler
export async function POST(request: NextRequest ) {
  const data = await request.formData();
  const file = data.get('file') as File;

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  // Save file to disk
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = path.extname(file.name);
  const fileName = `${path.basename(file.name, extension)}-${Date.now()}-${extension}`;
  const filePath = join('/uploads/profiles', fileName);
  await writeFile(join('public/', filePath), buffer);

  console.log('File saved to:', filePath);
  return NextResponse.json({sucess: true, filePath});


}
