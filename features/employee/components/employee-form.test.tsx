import { employeeFormSchema } from "./employee-form";

describe("UT-EMP-01 & 02: EmployeeForm Validation (Zod Schema)", () => {
  it("should fail validation when Salary is negative", () => {
    const mockData = {
      nik: "1234567890123456",
      firstName: "Budi",
      lastName: "Santoso",
      email: "budi@ems.com",
      phone: "08123456789",
      gender: "Male",
      birthPlace: "Jakarta",
      birthDate: "2000-01-01",
      address: "Jl Sudirman",
      departmentCode: "IT",
      positionCode: "STAFF",
      status: "Active",
      joinDate: "2023-01-01",
      basicSalary: -5000,
    };

    const result = employeeFormSchema.safeParse(mockData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const salaryError = result.error.issues.find((i) => i.path[0] === "basicSalary");
      expect(salaryError?.message).toBe("Salary must be >= 0");
    }
  });

  it("should fail validation when Phone contains letters", () => {
    const mockData = {
      nik: "1234567890123456",
      firstName: "Budi",
      lastName: "Santoso",
      email: "budi@ems.com",
      phone: "ABCD081234",
      gender: "Male",
      birthPlace: "Jakarta",
      birthDate: "2000-01-01",
      address: "Jl Sudirman",
      departmentCode: "IT",
      positionCode: "STAFF",
      status: "Active",
      joinDate: "2023-01-01",
      basicSalary: 5000,
    };

    const result = employeeFormSchema.safeParse(mockData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const phoneError = result.error.issues.find((i) => i.path[0] === "phone");
      expect(phoneError?.message).toBe("Phone Number must contain only numbers");
    }
  });
});
