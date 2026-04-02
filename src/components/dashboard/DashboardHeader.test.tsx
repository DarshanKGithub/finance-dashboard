import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

describe("DashboardHeader", () => {
  it("renders user info and supports role switching", () => {
    const onRoleChange = vi.fn();

    render(
      <DashboardHeader
        user={{ id: "u-1", name: "Ariana Blake", email: "admin@finflow.com", role: "admin" }}
        onLogout={() => undefined}
        onRoleChange={onRoleChange}
        theme="light"
        onThemeToggle={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Role switch"), { target: { value: "viewer" } });

    expect(screen.getByText("Ariana Blake")).toBeInTheDocument();
    expect(onRoleChange).toHaveBeenCalledWith("viewer");
  });
});
