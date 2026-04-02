import { Role } from "@/types/finance";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type AuthUser = Omit<MockUser, "password">;

export const AUTH_STORAGE_KEY = "finance-dashboard-auth-v1";

export const mockUsers: MockUser[] = [
  {
    id: "u-admin-1",
    name: "Zorvyn Admin",
    email: "admin@zorvyn.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-viewer-1",
    name: "Darshan Kshetri",
    email: "viewer@zorvyn.com",
    password: "viewer123",
    role: "viewer",
  },
];
