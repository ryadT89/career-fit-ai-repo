import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    
    const filePath = (await request.json())['filePath'];
    const path = join('public/', filePath);
    // remove the file in path
    await fs.unlink(path);

    return NextResponse.json({ success: true });
}