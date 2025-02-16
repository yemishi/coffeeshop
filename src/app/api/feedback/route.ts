import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id")
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
        const feedbacks = await db.feedback.findMany();

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch feedback." }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const { coffeeStars, message, userId } = await req.json();

        if (!coffeeStars || !message || !userId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }
        const feedback = await db.feedback.create({
            data: {
                coffeeStars,
                message,
                userId,
            },
        });

        return NextResponse.json({ message: "Feedback created successfully!", feedback }, { status: 201 });

    } catch (error) {
        console.log(error);
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
        console.log(error);
        return NextResponse.json({ error: "Failed to delete feedback." }, { status: 500 });
    }
}
