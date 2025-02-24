"use client"
import { fadeAnimation } from "@/utils/animations";
import Form, { InputsType } from "../Form";
import { motion } from "framer-motion"
import { HTMLAttributes, ReactNode, useState } from "react";
import { signIn } from "next-auth/react";

interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export default function SignInForm({ children, ...props }: Props) {
    const { className = "", ...rest } = props
    const [isError, setIsError] = useState("")
    const inputs: InputsType = {
        username: { label: "Email or name", value: "", min: 3, inputProps: { autoFocus: true } },
        password: { value: "", label: "Password", isPassword: true, min: 3, inputProps: { autoComplete: "new-password" } }
    }
    const onSubmit = async (values: { username: string, password: string }) => {
        console.log(values)
        const response = await signIn("credentials", { name: values.username, password: values.password, redirect: false })
        if (!response?.ok) setIsError("Name or password invalid")
        console.log(response)
    }

    return <div className={`flex flex-col p-4   overflow-x-hidden relative ${className} ${className.includes("w-") ? "" : "w-full"}`} {...rest}>
        <motion.h1 className="text-3xl ml-2 font-title text-black font-bold tracking-tighter"
            {...fadeAnimation({ initial: { y: "top" } })} >
            Log in to coffee shop
        </motion.h1>
        {isError && <motion.p {...fadeAnimation({ initial: { y: 0 }, exit: { y: 0, x: "right" } })} className="text-red-500 absolute right-6 top-6 mt-10 font-medium">{isError}</motion.p>}

        <motion.span
            {...fadeAnimation({ initial: { y: 0, x: -50 }, exit: { y: 0, x: -50 } })}
            transition={{ type: "tween" }}>
            <Form className="w-full mt-5" onSubmit={onSubmit} loadingMessage="Logging" submitMessage="Sign in" inputs={inputs} />
        </motion.span>
        {/* to do: recover password flow */}
        <motion.button
            {...fadeAnimation({})}
            className="underline tracking-tighter text-primary-600 underline-offset-4 hover:text-primary-500 cursor-pointer active:text-primary-600/50 self-center"
        >
            Forgot your password?
        </motion.button>

        {children}
    </div >
}