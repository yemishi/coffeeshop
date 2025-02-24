"use client"
import { fadeAnimation } from "@/utils/animations";
import Form, { InputsType } from "../Form";
import { motion } from "framer-motion"
import { HTMLAttributes, ReactNode, useState } from "react";
import { useReward } from "react-rewards";

interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export default function SignUpForm({ children, ...props }: Props) {
    const { className = "", ...rest } = props
    const [data, setData] = useState<{ error: boolean, msg: string }>()
    const { reward, isAnimating } = useReward("successReward", "emoji", {
        emoji: ["☕", "🍪"], elementCount: 35, spread: 90, fps: 75
    });
    const inputs: InputsType = {
        username: { label: "Name", value: "", min: 3, inputProps: { autoFocus: true } },
        email: { label: "Email", value: "", isEmail: true },
        password: { value: "", label: "Password", isPassword: true, min: 3, inputProps: { autoComplete: "new-password" } },
        confirmPassword: { value: "", label: "Confirm Password", isPassword: true, compareField: "password", inputProps: { autoComplete: "new-password" } }
    }
    const onSubmit = async (values: { email: "string", username: string, password: string }) => {

        if (data && !data?.error) {
            reward()
            return
        };
        const { email, password, username } = values
        const body = { name: username, email, password }
        try {
            const response = await fetch("/api/user", { method: "POST", body: JSON.stringify(body) })
            if (!response.ok) {
                const data = await response.json()
                setData({ msg: data.message, error: true })
                return
            }
            const data = await response.json()
            setData({ error: false, msg: data.message })
            setTimeout(() => reward(), 100)
            return
        } catch (error: any) {
            setData({ error: true, msg: error?.message || "We had some error" })
        }
    }

    return <div className={`flex flex-col p-4 overflow-x-hidden relative ${className} ${className.includes("w-") ? "" : "w-full"}`} {...rest}>
        {data && <motion.p {...fadeAnimation({ initial: { y: 0 }, exit: { y: 0, x: "right" } })} className={`${data.error ? "text-red-500" : "text-green-500"} absolute right-6 top-6 mt-10 font-medium`}>{data.msg}</motion.p>}

        <motion.h1 className="text-3xl ml-2 font-title  text-black font-bold  tracking-tighter"
            {...fadeAnimation({ initial: { y: "top" } })} >
            Sign up to coffee shop
        </motion.h1>

        <motion.span
            {...fadeAnimation({ initial: { y: 0, x: -50 }, exit: { y: 0, x: -50 } })}
            transition={{ type: "tween" }}>
            <Form disabled={isAnimating} className="w-full mt-5" onSubmit={onSubmit} isSuccess={data && !data.error} submitMessage="Sign up" loadingMessage="signing up" inputs={inputs} />
        </motion.span>
        {children}
    </div>
}