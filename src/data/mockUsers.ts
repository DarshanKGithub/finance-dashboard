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
    name: "Ariana Blake",
    email: "admin@finflow.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-viewer-1",
    name: "Leo Carter",
    email: "viewer@finflow.com",
    password: "viewer123",
    role: "viewer",
  },
];
