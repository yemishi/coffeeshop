import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Form from "./Form";

const inputs = {
    name: { label: "Name", value: "John Doe" },
    email: { label: "Email", value: "john@example.com", isEmail: true },
    password: { label: "Password", value: "password123", isPassword: true },
};

describe("Form Component", () => {
    it("renders input fields and submit button", () => {
        render(<Form inputs={inputs} onSubmit={jest.fn()} />);

        expect(screen.getByLabelText(/Name/i)).toBeTruthy();
        expect(screen.getByLabelText(/Email/i)).toBeTruthy();
        expect(screen.getByLabelText(/Password/i)).toBeTruthy();
        expect(screen.getByRole("button", { name: /Send/i })).toBeTruthy();
    });

    it("submits the form with the correct values", async () => {
        const handleSubmit = jest.fn(() => Promise.resolve());
        render(<Form inputs={inputs} onSubmit={handleSubmit} submitMessage="Send" />);

        const submitButton = screen.getByRole("button", { name: /Send/i });
        fireEvent.click(submitButton);

        await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
        expect(handleSubmit).toHaveBeenCalledWith({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        });
    });
});
