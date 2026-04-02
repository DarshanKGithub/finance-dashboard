import { fireEvent, render, screen } from "@testing-library/react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

describe("DashboardHeader", () => {
  it("renders user info and toggles theme", () => {
    const onThemeToggle = vi.fn();

    render(
      <DashboardHeader
        user={{ id: "u-1", name: "Zorvyn Admin", email: "admin@zorvyn.com", role: "admin" }}
        onLogout={() => undefined}
        theme="light"
        onThemeToggle={onThemeToggle}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Dark Mode" }));

    expect(screen.getByText("Zorvyn Admin")).toBeInTheDocument();
    expect(screen.queryByLabelText("Role switch")).not.toBeInTheDocument();
    expect(onThemeToggle).toHaveBeenCalled();
  });
});
