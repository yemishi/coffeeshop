import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

interface PropsType extends HTMLMotionProps<"button"> {
    isLoading?: boolean;
    children?: React.ReactNode;
    isSuccess?: boolean;
    loadingMessage?: string;
    rewardId?: string
}

export default function Button({ rewardId, loadingMessage = "loading", children = "Send", isSuccess, isLoading, ...props }: PropsType) {
    const { className = "", type = "button", ...rest } = props
    return <AnimatePresence mode="wait" >
        <motion.button key="custom-button"
            type={type}
            disabled={isLoading}
            className={clsx(isSuccess ? "bg-green-900 px-2 w-fit" : `${className.includes("bg-") ? "" : "bg-primary-600"} px-4`, className,
                className.includes("rounded") ? "" : "rounded-full ", "py-2 flex overflow-hidden justify-center font-medium cursor-pointer self-center hover:opacity-90 active:scale-95 ")}
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            {...rest}  >
            {isSuccess ?
                <motion.span
                    className="inline-block size-6 p-0.5"
                    id={rewardId || "successReward"}
                    key="success"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <img src="/icons/success.svg" alt="success" />
                </motion.span> : isLoading ? <motion.span
                    key="loading"
                    className="flex flex-row items-center gap-1"
                    variants={{
                        hidden: { opacity: 0, y: -50 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { staggerChildren: 0.1, ease: "easeInOut" },
                        },
                        exit: { opacity: 0, y: 100 },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {loadingMessage.split("").map((letter, index) => (
                        <motion.span
                            key={`loading-letter-${index}`}
                            variants={{
                                hidden: { y: 0 },

                                visible: {
                                    opacity: 1,
                                    y: [0, 7, -7, 0],
                                    transition: {
                                        duration: 0.7,
                                        repeat: Infinity,
                                        repeatDelay: 1.8,
                                        ease: "easeInOut",
                                    },
                                }, exit: { opacity: 0, y: 100 },
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.span> : <motion.span
                    key="children"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {children}
                </motion.span>}
        </motion.button>
    </AnimatePresence >

}