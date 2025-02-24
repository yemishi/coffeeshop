import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


type UserToken = {
    id: string;
    name: string;
    picture: string;
    isAdmin?: boolean;
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out"
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "name", type: "text", placeholder: "jsmith" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.name || !credentials.password) return null;
                const { name, password } = credentials;

                const user = await db.user.findFirst({
                    where: { OR: [{ name: name }, { email: name }] }
                });

                if (!user) throw new Error("User not found");;

                const checkPass = await compare(password, user.password as string);

                if (!checkPass) throw new Error("Password invalid");
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

                (await cookies()).set({
                    name: "token",
                    value: token,
                    httpOnly: true,
                    path: "/"
                })
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture,
                    isAdmin: user.isAdmin
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, trigger, session, user }) {
            if (user) {
                const customUser = user as UserToken
                token.id = customUser.id;
                token.username = customUser.name;
                token.picture = customUser.picture;
                token.isGuest = customUser.isAdmin;
            }

            if (trigger === "update" && session) {
                token.name = session.name || token.name;
                token.picture = session.picture || token.picture;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                name: token.name as string,
                email: token.email as string,
                picture: token.picture as string,
                isAdmin: token.isAdmin as boolean,
            };
            return session;
        },
        redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            return baseUrl;
        },
    },
};
