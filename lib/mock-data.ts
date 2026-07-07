export const SEED_DATA: Record<string, unknown[]> = {
  employees: [
    {
      id: "1",
      employeeCode: "EMP001",
      nik: "3273010101900001",
      firstName: "Super",
      lastName: "Admin",
      gender: "Male",
      birthPlace: "Bandung",
      birthDate: "1990-01-01",
      email: "admin@ems.com",
      phone: "081234567890",
      address: "Jl. Asia Afrika No. 1, Bandung",
      departmentCode: "HRD",
      positionCode: "HRM",
      userId: "1",
      basicSalary: 15000000,
      status: "Active",
      joinDate: "2022-01-10",
      image: "/images/avatar.jpeg",
      createdAt: "2022-01-10T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "2",
      employeeCode: "EMP002",
      nik: "3273010202920002",
      firstName: "Sarah",
      lastName: "Putri",
      gender: "Female",
      birthPlace: "Jakarta",
      birthDate: "1992-02-02",
      email: "sarah@ems.com",
      phone: "081298765432",
      address: "Jl. Sudirman No. 12, Jakarta",
      departmentCode: "IT",
      positionCode: "SE",
      userId: "2",
      basicSalary: 10000000,
      status: "Active",
      joinDate: "2023-05-15",
      image: "/images/avatar2.jpeg",
      createdAt: "2023-05-15T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "3",
      employeeCode: "EMP003",
      nik: "3273010303950003",
      firstName: "Budi",
      lastName: "Santoso",
      gender: "Male",
      birthPlace: "Yogyakarta",
      birthDate: "1995-03-03",
      email: "budi@ems.com",
      phone: "081377777777",
      address: "Jl. Malioboro No. 99, Yogyakarta",
      departmentCode: "FIN",
      positionCode: "FA",
      userId: "3",
      basicSalary: 8500000,
      status: "Inactive",
      joinDate: "2024-01-20",
      image: "/images/avatar3.jpeg",
      createdAt: "2024-01-20T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    }
  ],
  positions: [
    {
      id: "1",
      code: "HRM",
      name: "HR Manager",
      departmentCode: "HRD",
      level: 5,
      description: "Responsible for managing all Human Resource activities.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "2",
      code: "SE",
      name: "Software Engineer",
      departmentCode: "IT",
      level: 3,
      description: "Develop and maintain company software applications.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "3",
      code: "FA",
      name: "Finance Analyst",
      departmentCode: "FIN",
      level: 2,
      description: "Analyze financial reports and company budgeting.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    }
  ],
  users: [
    {
      id: "1",
      employeeCode: "EMP001",
      username: "superadmin",
      email: "admin@ems.com",
      password: "admin123",
      role: "superadmin",
      image: "/images/avatar.jpeg",
      isActive: true,
      createdAt: "2022-01-10T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "2",
      employeeCode: "EMP002",
      username: "sarah",
      email: "sarah@ems.com",
      password: "hrd123",
      role: "hrd",
      image: "/images/avatar2.jpeg",
      isActive: true,
      createdAt: "2023-05-15T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "3",
      employeeCode: "EMP003",
      username: "budi",
      email: "budi@ems.com",
      password: "employee123",
      role: "employee",
      image: "/images/avatar3.jpeg",
      isActive: true,
      createdAt: "2024-01-20T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    }
  ],
  departments: [
    {
      id: "1",
      code: "HRD",
      name: "Human Resource",
      managerEmployeeCode: "EMP001",
      description: "Responsible for recruitment, employee development, payroll, and company policies.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "2",
      code: "IT",
      name: "Information Technology",
      managerEmployeeCode: "EMP002",
      description: "Responsible for software development, infrastructure, and technical support.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    },
    {
      id: "3",
      code: "FIN",
      name: "Finance",
      managerEmployeeCode: "EMP003",
      description: "Responsible for budgeting, accounting, financial reporting, and company finance.",
      isActive: true,
      createdAt: "2022-01-01T08:00:00Z",
      updatedAt: "2026-07-07T08:00:00Z"
    }
  ]
};
