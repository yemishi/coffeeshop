"use client"
import { fadeAnimation } from "@/utils/animations";
import { motion } from "framer-motion"
import { HTMLAttributes, ReactNode, useState } from "react";
import useForm from "@/hooks/useForm";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useReward } from "react-rewards";

interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export default function ResetPassForm({ children, ...props }: Props) {
    const { className = "", ...rest } = props
    const [data, setData] = useState<{ error: boolean, msg: string }>()
    const [isLoading, setIsLoading] = useState(false)
    const [isSendingCode, setIsSendingCode] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const { reward: validCodeReward, isAnimating: isAnimatingCode } = useReward("validCodeReward", "emoji", {
        emoji: ["🍪"], elementCount: 25, spread: 90, fps: 75
    });

    const { reward, isAnimating } = useReward("passwordResetReward", "emoji", {
        emoji: ["☕"], elementCount: 35, spread: 90, fps: 75
    });

    const { errors, values, validateAll, validate, onChange } = useForm({
        email: { value: "", isEmail: true },
        password: { value: "", min: 3, },
        confirmPass: { value: "", compareField: "password" },
        code: { value: "", min: 6, minMessage: "invalid code" }

    })

    const verifyCode = async () => {
        if (!validate("code")) return

        const checkCode = await fetch(`api/user/password-reset?email=${values.email}&code=${values.code}`)
        const codeData = await checkCode.json()
        if (!checkCode.ok) {
            setData({ error: true, msg: codeData.message })
            return { error: !checkCode.ok, message: codeData.message }
        }

        setData({ error: false, msg: codeData.message })
        return { error: !checkCode.ok, message: codeData.message }
    }

    const sendCode = async () => {
        console.log("AAA")
        if (!validate("email")) return
        if (isSuccess) {
            console.log("AAaaaaA", isAnimatingCode)
            if (!isAnimatingCode) validCodeReward()
            return
        }
        setIsSendingCode(true)
        const response = await fetch("api/user/password-reset", { method: "POST", body: JSON.stringify({ email: values.email }) })
        const data = await response.json()
        setIsSendingCode(false)
        if (!response.ok) {
            setData({ error: true, msg: data.message })
            return
        }
        setData({ error: false, msg: data.message })
    }
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateAll()) return
        if (isSuccess) {
            if (!isAnimating) setTimeout(() => reward(), 100)
            return
        }
        setIsLoading(true)
        const codeData = await verifyCode()
        if (codeData?.error) {
            setData({ error: true, msg: codeData?.message })
            setIsLoading(false)
            return
        }
        const resetPass = await fetch("api/user", { method: "PATCH", body: JSON.stringify({ email: values.email, password: values.password }) })
        const resetPassData = await resetPass.json()
        setIsLoading(false)

        if (!resetPass.ok) {
            setData({ error: true, msg: resetPassData.message })
            return
        }

        setIsSuccess(true)
        setData({ error: false, msg: resetPassData.message })
        setTimeout(() => { reward(), validCodeReward() }, 100)
    }

    return <div className={`flex flex-col p-4   overflow-x-hidden relative ${className} ${className.includes("w-") ? "" : "w-full"}`} {...rest}>
        <motion.h1 className="text-3xl ml-2 font-title text-black font-bold tracking-tighter"
            {...fadeAnimation({ initial: { y: "top" } })} >
            Reset Your Password
        </motion.h1>
        {data && <motion.p {...fadeAnimation({ initial: { y: 0 }, exit: { y: 0, x: "right" } })} className={`${data.error ? "text-red-500" : "text-green-500"} 
        absolute right-6 top-6 mt-10 font-medium`}>{data.msg}</motion.p>}



        <motion.span
            {...fadeAnimation({ initial: { y: 0, x: -50 }, exit: { y: 0, x: -50 } })}
            transition={{ type: "tween" }}>
            <form onSubmit={onSubmit} className="gap-2 md:gap-3 3xl:gap-4 p-2 flex flex-col mt-5" >
                <Input error={errors["email"] as string} isLoading={isLoading} label="Email" value={values["email"]} name="email" onChange={onChange} />

                <div className="flex gap-3">
                    <Input error={errors["code"] as string} isLoading={isLoading} label="Code" value={values["code"]} maxLength={6} name="code" onChange={onChange} />
                    <Button type="button" loadingMessage="sending" onClick={sendCode} rewardId="validCodeReward" isLoading={isSendingCode || isLoading} isSuccess={isSuccess}
                        className={isSuccess ? "" : `text-black border-2 border-primary-400 rounded bg-primary-300/45 hover:bg-primary-300/75`}>Send code</Button>
                </div>

                <Input isPassword error={errors["password"] as string} isLoading={isLoading} label="New Password" value={values["password"]} name="password" onChange={onChange} />
                <Input isPassword error={errors["confirmPass"] as string} isLoading={isLoading} label="Confirm Password" value={values["confirmPass"]} name="confirmPass" onChange={onChange} />
                <Button type="submit" isSuccess={isSuccess} rewardId="passwordResetReward">Submit</Button>
            </form>
        </motion.span>
        {children}
    </div >
}