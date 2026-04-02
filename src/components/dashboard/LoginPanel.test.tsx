import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { LoginPanel } from "@/components/dashboard/LoginPanel";

describe("LoginPanel", () => {
  it("shows demo account hints", () => {
    render(<LoginPanel onLogin={() => undefined} theme="light" onThemeToggle={() => undefined} />);

    expect(screen.getByText("Admin Demo")).toBeInTheDocument();
    expect(screen.getByText("Viewer Demo")).toBeInTheDocument();
  });

  it("shows theme toggle on login screen", () => {
    const onThemeToggle = vi.fn();
    render(<LoginPanel onLogin={() => undefined} theme="light" onThemeToggle={onThemeToggle} />);

    fireEvent.click(screen.getByRole("button", { name: "Dark Mode" }));
    expect(onThemeToggle).toHaveBeenCalled();
  });

  it("rejects invalid credentials", () => {
    const onLogin = vi.fn();
    render(<LoginPanel onLogin={onLogin} theme="light" onThemeToggle={() => undefined} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "bad@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("logs in with valid credentials and normalizes email case", () => {
    const onLogin = vi.fn();
    render(<LoginPanel onLogin={onLogin} theme="light" onThemeToggle={() => undefined} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "ADMIN@ZORVYN.COM" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(onLogin).toHaveBeenCalledWith({
      id: "u-admin-1",
      name: "Zorvyn Admin",
      email: "admin@zorvyn.com",
      role: "admin",
    });
  });
});
