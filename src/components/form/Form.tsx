"use client"

import { FormHTMLAttributes, ReactNode, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import useForm, { FormField } from "@/hooks/useForm";

export type InputsType = Record<string, InputType>
interface InputType extends FormField {
    label: string;
    isPassword?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

interface PropsType<T> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
    inputs: InputsType;
    onSubmit: (values: T) => Promise<void>;
    isSuccess?: boolean;
    children?: ReactNode;
    loadingMessage?: string;
    submitMessage?: string;
    disabled?: boolean
};

export default function Form<T>({ inputs, disabled, loadingMessage, onSubmit, isSuccess, children, submitMessage, ...props }: PropsType<T>) {
    const [isLoading, setIsLoading] = useState(false)
    const { className = "", ...rest } = props
    const { errors, onChange, values, validateAll } = useForm(inputs)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return
        if (!validateAll()) return
        setIsLoading(true)
        await onSubmit(values as T)
        setIsLoading(false)
    };
    return <form onSubmit={handleSubmit} {...rest} className={`gap-2 md:gap-3 3xl:gap-4 p-2 flex flex-col ${className}`}>
        {Object.entries(inputs).map(([name, { label, inputProps, isPassword }], i) => {
            return <Input className="" disabled={isLoading} key={`${name}_${i}`} label={label} isPassword={isPassword} value={values[name]}
                error={errors[name] as string} name={name} onChange={onChange} {...inputProps} />

        })}
        <Button disabled={disabled} loadingMessage={loadingMessage} className="my-5" type="submit" isSuccess={isSuccess}
            isLoading={isLoading}>{submitMessage}</Button>
        {children}
    </form>
} 4