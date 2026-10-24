import { describe, it, expect } from 'vitest';
import {
  calculateTotalExpense,
  calculateNetSettlement,
  formatCurrency,
  formatCurrencyWithSymbol,
} from '../utils/calculations';
import { ExpenditureItem } from '../types/voucher';

describe('Calculations', () => {
  describe('calculateTotalExpense', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotalExpense([])).toBe(0);
    });

    it('should return 0 for null/undefined items', () => {
      expect(calculateTotalExpense(null as any)).toBe(0);
      expect(calculateTotalExpense(undefined as any)).toBe(0);
    });

    it('should calculate total correctly for simple amounts', () => {
      const items: ExpenditureItem[] = [
        { id: '1', srNo: 1, subject: 'Test 1', amount: 100 },
        { id: '2', srNo: 2, subject: 'Test 2', amount: 200 },
        { id: '3', srNo: 3, subject: 'Test 3', amount: 300 },
      ];
      expect(calculateTotalExpense(items)).toBe(600);
    });

    it('should handle decimal amounts correctly', () => {
      const items: ExpenditureItem[] = [
        { id: '1', srNo: 1, subject: 'Office Expense', amount: 8997.21 },
        { id: '2', srNo: 2, subject: 'Snacks and Pantry Expense', amount: 7895.79 },
      ];
      expect(calculateTotalExpense(items)).toBe(16893);
    });

    it('should calculate total matching the sample voucher', () => {
      const items: ExpenditureItem[] = [
        { id: '1', srNo: 1, subject: 'Balance Reimbursement for the month of August for Mr. Vijayanand Raut ', amount: 3552 },
        { id: '2', srNo: 2, subject: 'Travel Expense', amount: 807 },
        { id: '3', srNo: 3, subject: 'Office Expense', amount: 8997.21 },
        { id: '4', srNo: 4, subject: 'Electrical Items ', amount: 500 },
        { id: '5', srNo: 5, subject: 'Snacks and Pantry Expense', amount: 7895.79 },
        { id: '6', srNo: 6, subject: 'Courier Charges', amount: 364 },
        { id: '7', srNo: 7, subject: 'Consumer Charges', amount: 14095 },
      ];
      expect(calculateTotalExpense(items)).toBe(36211);
    });

    it('should handle non-numeric amounts as 0', () => {
      const items: ExpenditureItem[] = [
        { id: '1', srNo: 1, subject: 'Test', amount: 'abc' as any },
      ];
      expect(calculateTotalExpense(items)).toBe(0);
    });
  });

  describe('calculateNetSettlement', () => {
    it('should calculate net settlement correctly when money is returned', () => {
      // Petty cash advance 55100, total expense 36211, difference is 18889 returned
      expect(calculateNetSettlement(55100, 36211)).toBe(18889);
    });

    it('should calculate net settlement correctly when money is owed', () => {
      expect(calculateNetSettlement(30000, 40000)).toBe(-10000);
    });

    it('should return 0 when equal', () => {
      expect(calculateNetSettlement(5000, 5000)).toBe(0);
    });

    it('should handle null/undefined values', () => {
      expect(calculateNetSettlement(null as any, 1000)).toBe(-1000);
      expect(calculateNetSettlement(1000, null as any)).toBe(1000);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers in Indian style', () => {
      expect(formatCurrency(1000)).toBe('1,000');
      expect(formatCurrency(100000)).toBe('1,00,000');
    });

    it('should handle decimals', () => {
      expect(formatCurrency(8997.21)).toBe('8,997.21');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0');
    });

    it('should handle non-numeric as 0', () => {
      expect(formatCurrency(null as any)).toBe('0');
    });
  });

  describe('formatCurrencyWithSymbol', () => {
    it('should add rupee symbol', () => {
      expect(formatCurrencyWithSymbol(1000)).toBe('₹1,000');
    });

    it('should format decimals with symbol', () => {
      expect(formatCurrencyWithSymbol(8997.21)).toBe('₹8,997.21');
    });
  });
});
