import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { hashSync } from "bcrypt"

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email") as string
    const userId = req.nextUrl.searchParams.get("id") as string

    try {
        const field = email ? { email } : { id: userId }
        const user = await db.user.findFirst({ where: field, omit: { password: true } })
        if (!user) return NextResponse.json({ message: "user not found." }, { status: 404 })

        return NextResponse.json({ user, message: "user information retrieved successfully." }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user information." }, { status: 500 });

    }
}
export async function POST(req: NextRequest) {
    try {

        const { name, email, password } = await req.json();
        const unavailableEmail = await db.user.findFirst({ where: { email } })

        if (unavailableEmail) return NextResponse.json({ message: "Email has already been used." }, { status: 409 })

        const hashedPass = hashSync(password, 10)
        await db.user.create({
            data: { name, email, picture: "", password: hashedPass },
        });

        return NextResponse.json({ message: "user created successfully!" }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "failed to create the user." }, { status: 500 });
    }
}