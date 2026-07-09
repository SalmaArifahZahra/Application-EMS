import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./login-form";

const mockLogin = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock("@/features/auth/components/login-animation", () => ({
  LoginAnimation: () => <div>Animation Mock</div>
}));

describe("UT-AUTH-01 & 02: LoginForm Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should prevent submission and show error when fields are empty", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Email dan password wajib diisi/i)).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should prevent submission when password is empty", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Email dan password wajib diisi/i)).toBeInTheDocument();
  });
});
