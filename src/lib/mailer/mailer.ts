import nodemailer from "nodemailer";
import passwordResetTemplate from "./templates/passwordResetTemplate";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendPasswordResetEmail(email: string, code: string) {
    return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Code",
        html: passwordResetTemplate(code),
    });
}