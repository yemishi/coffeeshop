import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id")
    const query = req.nextUrl.searchParams.get("query") as string
    const orderBy = req.nextUrl.searchParams.get("orderBy") as "desc" | "asc"
    const page = Number(req.nextUrl.searchParams.get("page")) || 0
    const take = Number(req.nextUrl.searchParams.get("take")) || 5

    try {

        if (id) {
            const feedback = await db.feedback.findUnique({
                where: { id },
            });
            if (!feedback) {
                return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
            }
            return NextResponse.json({ feedback }, { status: 200 });
        }

        const feedbacks = await db.feedback.findMany({
            where: { user: { name: { contains: query } } },
            orderBy: orderBy ? { stars: orderBy } : {},
            take: take + 1,
            skip: take * page
        });
        const hasMore = feedbacks.length > take
        if (hasMore) feedbacks.pop()

        return NextResponse.json({ feedbacks, hasMore }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch feedback." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { stars, message, userId } = await req.json();

        if (!stars || !message || !userId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }
        const feedback = await db.feedback.create({
            data: {
                stars,
                message,
                userId,
            },
        });

        return NextResponse.json({ message: "Feedback created successfully!", feedback }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to create feedback." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")
    try {

        if (!id) {
            return NextResponse.json({ error: "Feedback ID is required." }, { status: 400 });
        }

        const feedback = await db.feedback.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Feedback deleted successfully!", feedback }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete feedback." }, { status: 500 });
    }
}
