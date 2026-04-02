import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Role, TransactionForm, TransactionType } from "@/types/finance";

type TransactionFormSectionProps = {
  role: Role;
  form: TransactionForm;
  isEditing: boolean;
  onFormChange: (next: TransactionForm) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export function TransactionFormSection({
  role,
  form,
  isEditing,
  onFormChange,
  onSubmit,
  onClear,
}: TransactionFormSectionProps) {
  const disabled = role !== "admin";

  return (
    <Card className="reveal mt-6 [animation-delay:720ms]">
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Admin Transaction Form</h2>
          <span className="text-xs text-slate-500">
            {disabled ? "Switch role to Admin to edit" : "Admin mode enabled"}
          </span>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            type="date"
            value={form.date}
            onChange={(event) => onFormChange({ ...form, date: event.target.value })}
            disabled={disabled}
          />
          <Input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(event) => onFormChange({ ...form, category: event.target.value })}
            disabled={disabled}
          />
          <Input
            type="number"
            min="1"
            placeholder="Amount"
            value={form.amount}
            onChange={(event) => onFormChange({ ...form, amount: event.target.value })}
            disabled={disabled}
          />
          <Select
            value={form.type}
            onChange={(event) => onFormChange({ ...form, type: event.target.value as TransactionType })}
            disabled={disabled}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Input
            type="text"
            placeholder="Note"
            value={form.note}
            onChange={(event) => onFormChange({ ...form, note: event.target.value })}
            disabled={disabled}
          />

          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-5">
            <Button type="submit" disabled={disabled}>
              {isEditing ? "Update Transaction" : "Add Transaction"}
            </Button>
            <Button type="button" variant="outline" onClick={onClear}>
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
