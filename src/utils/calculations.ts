import { ExpenditureItem } from '../types/voucher';

export function calculateTotalExpense(items: ExpenditureItem[]): number {
  if (!items || items.length === 0) {
    return 0;
  }
  const total = items.reduce((sum, item) => {
    const amount = typeof item.amount === 'number' ? item.amount : 0;
    return sum + amount;
  }, 0);
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(total * 100) / 100;
}

export function calculateNetSettlement(pettyCashAdvance: number, totalExpense: number): number {
  const advance = typeof pettyCashAdvance === 'number' ? pettyCashAdvance : 0;
  const expense = typeof totalExpense === 'number' ? totalExpense : 0;
  return Math.round((advance - expense) * 100) / 100;
}

export function formatCurrency(amount: number): string {
  const num = typeof amount === 'number' ? amount : 0;
  // Format as Indian number style would be nice but keep simple
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyWithSymbol(amount: number): string {
  return `₹${formatCurrency(amount)}`;
}
