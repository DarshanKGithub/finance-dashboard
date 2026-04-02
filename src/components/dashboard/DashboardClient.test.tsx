import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";

import { AUTH_STORAGE_KEY } from "@/data/mockUsers";
import { STORAGE_KEY } from "@/data/mockTransactions";
import DashboardClient from "@/components/dashboard/DashboardClient";

vi.mock("@/components/dashboard/ChartsSection", () => ({
  ChartsSection: () => <div data-testid="charts-section">Charts Section</div>,
}));

describe("DashboardClient", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("supports admin login and visible role switching", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "admin@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Fintech SaaS Command Center")).toBeInTheDocument();

    const roleSwitch = screen.getByLabelText("Role switch");
    expect(roleSwitch).toHaveValue("admin");

    fireEvent.change(roleSwitch, { target: { value: "viewer" } });

    expect(await screen.findByText(/Viewer mode is read-only/i)).toBeInTheDocument();
  });

  it("adds a transaction as admin and persists to localStorage", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "admin@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-04-02" } });
    fireEvent.change(screen.getByPlaceholderText("Category"), { target: { value: "Books" } });
    fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "99" } });
    fireEvent.change(screen.getByPlaceholderText("Note"), { target: { value: "Reference" } });
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));

    await waitFor(() => {
      expect(screen.getByText("13 records")).toBeInTheDocument();
    });

    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Array<{
      category: string;
      amount: number;
    }>;
    expect(saved.some((item) => item.category === "Books" && item.amount === 99)).toBe(true);
  });

  it("hydrates auth and transactions from localStorage", async () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ id: "u-admin-1", name: "Ariana Blake", email: "admin@finflow.com", role: "admin" }),
    );
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "t-100",
          date: "2026-03-20",
          category: "Snacks",
          amount: 25,
          type: "expense",
          note: "Office",
        },
      ]),
    );

    render(<DashboardClient />);

    expect(await screen.findByText("Fintech SaaS Command Center")).toBeInTheDocument();
    expect(screen.getAllByText("Snacks").length).toBeGreaterThan(0);
  });

  it("logs out and clears persisted auth", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "viewer@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "viewer123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    fireEvent.click((await screen.findAllByRole("button", { name: "Logout" }))[0]);

    expect(await screen.findByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it("falls back to seed transactions when stored data is malformed", async () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ id: "u-admin-1", name: "Ariana Blake", email: "admin@finflow.com", role: "admin" }),
    );
    window.localStorage.setItem(STORAGE_KEY, "{invalid-json");

    render(<DashboardClient />);

    expect(await screen.findByText("Fintech SaaS Command Center")).toBeInTheDocument();
    expect(screen.getByText("12 records")).toBeInTheDocument();
  });

  it("filters transactions and shows the no-match state", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "admin@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    fireEvent.change(screen.getByPlaceholderText("Search by note/category/date"), {
      target: { value: "no-such-transaction" },
    });

    expect(await screen.findByText(/No transactions found for the current filters/i)).toBeInTheDocument();
  });

  it("sorts table rows by amount low to high", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "admin@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    fireEvent.change(screen.getByDisplayValue("Latest First"), {
      target: { value: "low" },
    });

    const table = await screen.findByRole("table", { name: "transactions table" });
    const rows = within(table).getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Transport");
    expect(rows[1]).toHaveTextContent("$72");
  });

  it("keeps viewer mode read-only with no mutation controls", async () => {
    render(<DashboardClient />);

    fireEvent.change(await screen.findByPlaceholderText("Email"), {
      target: { value: "viewer@finflow.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "viewer123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText(/Viewer mode is read-only/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Transaction" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
