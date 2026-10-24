import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VoucherData, DEFAULT_VOUCHER_DATA, ExpenditureItem } from '../types/voucher';
import { calculateTotalExpense } from '../utils/calculations';

interface VoucherState {
  data: VoucherData;
  totalExpense: number;
}

const calculateTotal = (items: ExpenditureItem[]) => calculateTotalExpense(items);

const loadFromStorage = (): VoucherData => {
  try {
    const saved = localStorage.getItem('officeExpenseVoucherDraft');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_VOUCHER_DATA;
};

const initialState: VoucherState = {
  data: loadFromStorage(),
  totalExpense: calculateTotal(loadFromStorage().expenditureItems),
};

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    updateVoucherDate: (state, action: PayloadAction<string>) => {
      state.data.voucherDate = action.payload;
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    updateNarrativeText: (state, action: PayloadAction<string>) => {
      state.data.narrativeText = action.payload;
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    updatePettyCashAdvance: (state, action: PayloadAction<number>) => {
      state.data.pettyCashAdvance = action.payload;
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    updateSettlementStatusText: (state, action: PayloadAction<string>) => {
      state.data.settlementStatusText = action.payload;
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    addExpenditureItem: (state) => {
      const newId = String(Date.now());
      const newSrNo = state.data.expenditureItems.length + 1;
      state.data.expenditureItems.push({
        id: newId,
        srNo: newSrNo,
        subject: '',
        amount: 0,
      });
      state.totalExpense = calculateTotal(state.data.expenditureItems);
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    removeExpenditureItem: (state, action: PayloadAction<string>) => {
      state.data.expenditureItems = state.data.expenditureItems
        .filter(item => item.id !== action.payload)
        .map((item, index) => ({ ...item, srNo: index + 1 }));
      state.totalExpense = calculateTotal(state.data.expenditureItems);
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    updateExpenditureItem: (state, action: PayloadAction<{ id: string; field: 'subject' | 'amount'; value: string | number }>) => {
      const { id, field, value } = action.payload;
      const item = state.data.expenditureItems.find(item => item.id === id);
      if (item) {
        if (field === 'amount') {
          item.amount = typeof value === 'number' ? value : parseFloat(value as string) || 0;
        } else {
          item.subject = value as string;
        }
      }
      state.totalExpense = calculateTotal(state.data.expenditureItems);
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    resetVoucher: (state) => {
      state.data = DEFAULT_VOUCHER_DATA;
      state.totalExpense = calculateTotal(DEFAULT_VOUCHER_DATA.expenditureItems);
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
    loadVoucher: (state, action: PayloadAction<VoucherData>) => {
      state.data = action.payload;
      state.totalExpense = calculateTotal(action.payload.expenditureItems);
      try { localStorage.setItem('officeExpenseVoucherDraft', JSON.stringify(state.data)); } catch(e) {}
    },
  },
});

export const {
  updateVoucherDate,
  updateNarrativeText,
  updatePettyCashAdvance,
  updateSettlementStatusText,
  addExpenditureItem,
  removeExpenditureItem,
  updateExpenditureItem,
  resetVoucher,
  loadVoucher,
} = voucherSlice.actions;

export default voucherSlice.reducer;
