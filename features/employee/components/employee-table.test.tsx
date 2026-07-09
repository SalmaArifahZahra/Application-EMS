import React from "react";
import { render, screen } from "@testing-library/react";
import { EmployeeTable } from "./employee-table";
import { useAuth } from "@/features/auth/hooks/use-auth";

jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

jest.mock("./delete-employee-dialog", () => ({
  DeleteEmployeeButton: () => <button>Delete Employee Mock</button>,
}));

const dummyEmployees = [
  {
    id: "1",
    nik: "123",
    firstName: "Test",
    lastName: "User",
    email: "test@test.com",
    departmentCode: "IT",
    positionCode: "STAFF",
    basicSalary: 5000,
    status: "Active",
    image: "/avatar.png",
    gender: "L",
    birthPlace: "Jakarta",
    birthDate: "2000-01-01",
    phone: "0812345",
    address: "Jl A",
    joinDate: "2020-01-01",
    createdAt: "2020-01-01",
    updatedAt: "2020-01-01",
    userId: "1"
  },
];

describe("UT-RBAC-01, 02 & 03: EmployeeTable Button Permission", () => {
  it("should not render Delete button for HRD role", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: "hrd" },
    });

    render(<EmployeeTable employees={dummyEmployees} onRefresh={jest.fn()} />);

    expect(screen.getByText(/view/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.queryByText(/delete employee mock/i)).not.toBeInTheDocument();
  });

  it("should render Delete button for superadmin role", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: "superadmin" },
    });

    render(<EmployeeTable employees={dummyEmployees} onRefresh={jest.fn()} />);

    expect(screen.getByText(/view/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete employee mock/i)).toBeInTheDocument();
  });

  it("should not render Delete button for employee role", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { role: "employee" },
    });

    render(<EmployeeTable employees={dummyEmployees} onRefresh={jest.fn()} />);

    expect(screen.getByText(/view/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.queryByText(/delete employee mock/i)).not.toBeInTheDocument();
  });
});
