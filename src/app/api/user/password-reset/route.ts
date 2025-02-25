import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer/mailer";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email") as string
    const code = req.nextUrl.searchParams.get("code") as string

    try {
        if (!email || !code) return NextResponse.json({ message: "Email and code are required" }, { status: 404 });

        const resetRecord = await db.passwordResetCode.findFirst({
            where: { email, code },
        });

        if (!resetRecord || new Date() > resetRecord.expiresAt) {
            return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
        }

        return NextResponse.json({ message: "Code verified" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user information." }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try {

        const { email } = await req.json();
        const user = await db.user.findFirst({ where: { email } })

        if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 })

        const code = crypto.randomInt(100000, 999999).toString();
        await db.passwordResetCode.create({ data: { code, email, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } })
        await sendPasswordResetEmail(email, code)
        return NextResponse.json({ message: "Email sent successfully!" }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "failed to send email." }, { status: 500 });
    }
}