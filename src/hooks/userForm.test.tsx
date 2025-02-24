import { renderHook, act } from "@testing-library/react";
import useForm from "./useForm";

describe("useForm hook", () => {
    const initialValues = {
        username: { value: "", min: 3, minMessage: "Too short" },
        email: { value: "", isEmail: true },
        password: { value: "" },
        confirmPassword: { value: "", compareField: "password" },
    };

    test("should initialize form with correct values", () => {
        const { result } = renderHook(() => useForm(initialValues));
        expect(result.current.values).toEqual({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    });

    test("should update field value and validate it", () => {
        const { result } = renderHook(() => useForm(initialValues));

        act(() => {
            result.current.setValue("username", "Jo");
        });

        act(() => {
            result.current.validateAll();
        });

        expect(result.current.values.username).toBe("Jo");
        expect(result.current.errors.username).toBe("Too short");
    });

    test("should validate email format", () => {
        const { result } = renderHook(() => useForm(initialValues));

        act(() => {
            result.current.setValue("email", "invalid-email");
        });

        act(() => {
            result.current.validateAll();
        });

        expect(result.current.errors.email).toBe("Invalid email format.");
    });

    test("should validate all fields correctly", () => {
        const { result } = renderHook(() => useForm(initialValues));

        act(() => {
            result.current.setValue("username", "A");
            result.current.setValue("email", "notanemail");
        });

        act(() => {
            result.current.validateAll();
        });

        expect(result.current.errors.username).toBe("Too short");
        expect(result.current.errors.email).toBe("Invalid email format.");
    });

    test("should validate password confirmation", () => {
        const { result } = renderHook(() => useForm(initialValues));

        act(() => {
            result.current.setValue("password", "securePass123");
            result.current.setValue("confirmPassword", "wrongPass");
        });

        act(() => {
            result.current.validateAll();
        });

        expect(result.current.errors.confirmPassword).toBe("Must be equal to password");
    });

    test("should reset form correctly", () => {
        const { result } = renderHook(() => useForm(initialValues));

        act(() => {
            result.current.setValue("username", "JohnDoe");
            result.current.setValue("email", "john@example.com");
        });

        act(() => {
            result.current.resetForm();
        });

        expect(result.current.values.username).toBe("");
        expect(result.current.values.email).toBe("");
    });
});
