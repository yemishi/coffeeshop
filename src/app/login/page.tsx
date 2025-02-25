"use client"
import SignInForm from "@/components/form/login/SignInForm";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { motion } from "framer-motion"
import { lazy, useState } from "react";
import { fadeAnimation } from "@/utils/animations";

const SignUpForm = lazy(() => import("@/components/form/login/SignUpForm"))
const ResetPassForm = lazy(() => import("@/components/form/login/ResetPassForm"))


export default function Login() {
  const [action, setAction] = useState<"signIn" | "signUp" | "reset-pass">("signIn")

  return <div className="w-full md justify-center items-center h-full flex bg-primary-200 md:bg-transparent flex-col relative
bg-cover bg-center ">

    <div className="hidden md:block absolute inset-0 bg-[url('/images/coffee-bg.png')] -z-10 bg-cover bg-center blur-lg" />
    <div className="absolute inset-0 bg-primary-200/30 hidden md:block -z-10 " />

    <div className="flex overflow-x-hidden flex-col h-full w-full md:w-xl md:relative md:h-[600px] 3xl:w-3xl md:rounded-lg md:shadow-xl md:p-9 3xl:px-14 md:bg-primary-200">
      <Link href="/" className="hidden md:block hover:scale-105 active:scale-95 cursor-pointer absolute right-5 top-5 duration-150">
        <motion.img {...fadeAnimation({ initial: { y: "top", x: "right" } })} src="icons/favicon.svg" className="size-18" />
      </Link>
      <AnimatePresence mode="wait">
        {action === "signIn" ? <SignInForm resetPass={() => setAction("reset-pass")} className="mt-auto min-h-[408px] " key="signIn" /> :
          action === "signUp" ?
            <SignUpForm className="mt-auto min-h-[408px]  " key="singUp" /> : <ResetPassForm />
        }
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={action === "signIn" ? "signInText" : "signUpText"}
          className="md:text-lg gap-1 items-center self-center flex text-primary-500 mt-auto  justify-self-end"
          {...fadeAnimation({})}
        >
          {action === "signIn" ? (
            <AuthText
              action={() => setAction("signUp")}
              text="Don't have an account?"
              buttonText="Sign up for coffee shop"
            />
          ) : action === "signUp" ? (
            <AuthText
              action={() => setAction("signIn")}
              text="Already have an account?"
              buttonText="Sign in for coffee shop"
            />) : (<AuthText
              action={() => setAction("signIn")} text="Did you recover your password?" buttonText="Sign in for coffee shop" />
          )}
        </motion.div>
      </AnimatePresence>

      <span className={`border-t-1 my-3 md:hidden bg-black border-primary-300 w-[93%] self-center`} />
      <Link
        href="/"
        className="tracking-tighter md:hidden self-center mb-2 md:mb-0 text-primary-600 hover:text-primary-500 text-lg md:text-xl font-semibold"
      >
        Go Home
      </Link>
    </div>
  </div>
}


const AuthText = ({ text, buttonText, action }: { text: string; buttonText: string, action: () => void }) => (
  <>
    <motion.span  {...fadeAnimation({ initial: { y: 0, x: "left" }, exit: { y: 30, x: "left" } })}>{text}</motion.span>
    <motion.button
      onClick={action}
      {...fadeAnimation({ initial: { y: 0, x: "right" }, exit: { y: 30, x: "right" } })}
      className="underline tracking-tighter text-primary-600 underline-offset-4 hover:text-primary-500 active:text-primary-600/50 cursor-pointer"
    >
      {buttonText}
    </motion.button>
  </>
);