import { seedTransactions } from "@/data/mockTransactions";
import { Transaction } from "@/types/finance";

export async function fetchMockTransactions(delayMs = 180): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return seedTransactions.map((item) => ({ ...item }));
}
