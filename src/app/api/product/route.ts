import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("query") || ""
    const orderBy = req.nextUrl.searchParams.get("orderBy") as "desc" | "asc"
    const page = Number(req.nextUrl.searchParams.get("page")) || 0
    const take = Number(req.nextUrl.searchParams.get("take")) || 5
    const id = req.nextUrl.searchParams.get("id") as string

    try {

        if (id) {
            const product = await db.product.findFirst({ where: { id } })
            return NextResponse.json({ product }, { status: 200 })
        }

        const products = await db.product.findMany({
            where: { name: { contains: query } },
            take: take + 1,
            skip: take * page,
            orderBy: orderBy ? { price: orderBy } : {},
        });
        const hasMore = products.length > take
        if (hasMore) products.pop()

        return NextResponse.json({ products, hasMore }, { status: 200 });
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