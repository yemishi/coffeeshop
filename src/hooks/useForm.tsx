import { useMemo, useState } from "react"

interface ValidationRule {
    value?: number;
    msg: string;
}

interface Field {
    value: string | number;
    min?: ValidationRule;
    max?: ValidationRule;
    compareField?: string
    isEmail?: boolean
    validate?: (value: string | number) => string | null;
}

type FormFields = Record<string, Field>

export default function useForm(initialValues: FormFields) {

    const [fields, setFields] = useState(initialValues)
    const [errors, setErrors] = useState<Record<string, string | null>>({})
    const values = Object.fromEntries(
        Object.entries(fields).map(([key, field]) => [key, field.value])
    ) as { [K in keyof typeof fields]: typeof fields[K]["value"] };

    const handleError = (field: string, msg: string | null) => setErrors((e) => ({ ...e, [field]: msg }))
    const validateField = (name: string, value: string | number | string[]): string | null => {
        const field = fields[name];
        if (!field) return null;

        const { compareField, max, min, validate, isEmail } = field;
        const len = typeof (value) === "number" ? value : value.length
        if (max && len > max.value!) return max.msg;
        if (min && len < min.value!) return min.msg;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (isEmail && !emailRegex.test(String(value))) return "Invalid email format.";

        if (validate && !Array.isArray(value)) return validate(value);
        if (compareField && fields[compareField]) {
            const fieldToCompare = fields[compareField]
            if (fieldToCompare.value !== value) return `Must be equal to ${compareField}`
        }

        return null;
    };

    const validateAll = () => {
        const newErrors: Record<string, string | null> = {};

        for (const name in fields) {
            const value = fields[name].value

            const error = validateField(name, value);
            newErrors[name] = error;
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => !err);
    };
    const onChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>, customValue?: string | number) => setValue(name, customValue ?? value);
    const setValue = (fieldName: string, value: string | number) => {
        const field = fields[fieldName];
        if (field) {
            setFields((e) => ({ ...e, [fieldName]: { ...field, value } }));
            const error = validateField(fieldName, value);
            handleError(fieldName, error);
        }
    }

    const resetForm = () => { setFields(initialValues), setErrors({}) }
    const fieldsKey = useMemo(() => Object.keys(fields), [fields]);

    return { fieldsKey, rawValues: fields, values, errors, onChange, validateAll, resetForm, setValue };
}
