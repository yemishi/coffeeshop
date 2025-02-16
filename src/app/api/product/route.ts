import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
    try {
        const products = await db.product.findMany();

        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch products." }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {

    try {
        const { picture, name, price, desc } = await req.json()
        await db.product.create({
            data: { name, desc, price, picture, },
        });

        return NextResponse.json({ message: "Image uploaded successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "File processing error" }, { status: 500 });
    }
}