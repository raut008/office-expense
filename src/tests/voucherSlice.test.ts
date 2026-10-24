import { describe, it, expect } from 'vitest';
import voucherReducer, {
  updateVoucherDate,
  updateNarrativeText,
  updatePettyCashAdvance,
  updateSettlementStatusText,
  addExpenditureItem,
  removeExpenditureItem,
  updateExpenditureItem,
  resetVoucher,
} from '../store/voucherSlice';
import { DEFAULT_VOUCHER_DATA } from '../types/voucher';

describe('voucherSlice', () => {
  const initialState = {
    data: DEFAULT_VOUCHER_DATA,
    totalExpense: 36211,
  };

  it('should return initial state', () => {
    expect(voucherReducer(undefined, { type: 'unknown' })).toEqual({
      data: DEFAULT_VOUCHER_DATA,
      totalExpense: 36211,
    });
  });

  it('should update voucher date', () => {
    const actual = voucherReducer(initialState, updateVoucherDate('31/10/2026'));
    expect(actual.data.voucherDate).toBe('31/10/2026');
  });

  it('should update narrative text', () => {
    const newText = 'New narrative text';
    const actual = voucherReducer(initialState, updateNarrativeText(newText));
    expect(actual.data.narrativeText).toBe(newText);
  });

  it('should update petty cash advance', () => {
    const actual = voucherReducer(initialState, updatePettyCashAdvance(60000));
    expect(actual.data.pettyCashAdvance).toBe(60000);
  });

  it('should update settlement status text', () => {
    const newText = 'Amount to be received from Mr. Test';
    const actual = voucherReducer(initialState, updateSettlementStatusText(newText));
    expect(actual.data.settlementStatusText).toBe(newText);
  });

  it('should add expenditure item', () => {
    const actual = voucherReducer(initialState, addExpenditureItem());
    expect(actual.data.expenditureItems.length).toBe(8);
    expect(actual.data.expenditureItems[7].srNo).toBe(8);
  });

  it('should remove expenditure item', () => {
    const itemToRemove = initialState.data.expenditureItems[0].id;
    const actual = voucherReducer(initialState, removeExpenditureItem(itemToRemove));
    expect(actual.data.expenditureItems.length).toBe(6);
    // srNo should be recalculated
    expect(actual.data.expenditureItems[0].srNo).toBe(1);
  });

  it('should update expenditure item subject', () => {
    const itemId = initialState.data.expenditureItems[0].id;
    const actual = voucherReducer(
      initialState,
      updateExpenditureItem({ id: itemId, field: 'subject', value: 'New Subject' })
    );
    expect(actual.data.expenditureItems[0].subject).toBe('New Subject');
  });

  it('should update expenditure item amount and recalculate total', () => {
    const itemId = initialState.data.expenditureItems[0].id;
    const actual = voucherReducer(
      initialState,
      updateExpenditureItem({ id: itemId, field: 'amount', value: 5000 })
    );
    expect(actual.data.expenditureItems[0].amount).toBe(5000);
    expect(actual.totalExpense).toBe(5000 + 807 + 8997.21 + 500 + 7895.79 + 364 + 14095);
  });

  it('should reset voucher to defaults', () => {
    const modifiedState = voucherReducer(initialState, updateVoucherDate('01/01/2027'));
    const actual = voucherReducer(modifiedState, resetVoucher());
    expect(actual.data.voucherDate).toBe(DEFAULT_VOUCHER_DATA.voucherDate);
    expect(actual.totalExpense).toBe(36211);
  });
});
