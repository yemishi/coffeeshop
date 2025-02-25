import { forwardRef, InputHTMLAttributes, useState } from "react";
import clsx from "clsx"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isLoading?: boolean;
    isPassword?: boolean;
    classNameInput?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, isPassword, classNameInput = "", type = "text", className = "", isLoading, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        return (
            <div className={clsx("gap-1 relative pt-2.5", className)} >
                <label htmlFor={props.id || props.name} className={clsx("absolute transform z-1 duration-200 text-primary-500 cursor-default",
                    props.value ? "bottom-2/4 md:bottom-3/5 scale-80 font-medium left-2.5 origin-left" : "bottom-1 left-2", error ? "text-red-500" : "")}>{label}</label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={props.id || props.name}
                        type={isPassword ? (showPassword ? "text" : "password") : type}
                        className={clsx(
                            "w-full px-2.5 pt-2 pb-1 outline-none border-b-2 rounded-md transition text-black disabled:text-primary-400 placeholder:text-primary-400",
                            error ? "border-b-red-500" : "border-b-primary-500 focus:border-b-primary-400",
                            classNameInput, isPassword ? "pr-9" : ""
                        )}
                        {...props}
                    />
                    {isPassword &&
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute size-6 right-2 -translate-y-[50%] top-[50%]"
                        >
                            <img src={`/icons/${showPassword ? "eye.svg" : "eye-closed.svg"}`} className="cursor-pointer" alt={showPassword ? "eye" : "eye closed"} />
                        </button>}

                </div>

                {error && <p className="text-red-500 text-xs md:text-sm 3xl:text-base  absolute top-1 md:top-0 3xl:-top-1 font-medium right-2">{error}</p>}
            </div>
        );
    }
);

Input.displayName == "Input"
export default Input