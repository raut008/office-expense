export interface ExpenditureItem {
  id: string;
  srNo: number;
  subject: string;
  amount: number;
}

export interface VoucherData {
  companyName: string;
  companyAddress: string;
  voucherDate: string;
  voucherTitle: string;
  narrativeText: string;
  expenditureItems: ExpenditureItem[];
  pettyCashAdvance: number;
  settlementStatusText: string;
  signatory: string;
}

export const DEFAULT_VOUCHER_DATA: VoucherData = {
  companyName: 'SOMA TEXTILE & INDUSTRIES LIMITED',
  companyAddress: '5/B, Bhaktawar, NARIMAN POINT, MUMBAI 400 021',
  voucherDate: '28/09/2026',
  voucherTitle: 'OFFICE EXPENSES VOUCHER',
  narrativeText: 'Bhaktawar Office: Petty cash withdrawal of ₹10,000 on 3rd September 2026. Difference amount given to Mr. Vijayanand Raut and ₹100 received from Soma Textiles, Vasvani Chambers, Churchgate. Further, an amount of ₹45,000 was received on 30th September 2026.',
  expenditureItems: [
    { id: '1', srNo: 1, subject: 'Balance Reimbursement for the month of August for Mr. Vijayanand Raut ', amount: 3552 },
    { id: '2', srNo: 2, subject: 'Travel Expense', amount: 807 },
    { id: '3', srNo: 3, subject: 'Office Expense', amount: 8997.21 },
    { id: '4', srNo: 4, subject: 'Electrical Items ', amount: 500 },
    { id: '5', srNo: 5, subject: 'Snacks and Pantry Expense', amount: 7895.79 },
    { id: '6', srNo: 6, subject: 'Courier Charges', amount: 364 },
    { id: '7', srNo: 7, subject: 'Consumer Charges', amount: 14095 },
  ],
  pettyCashAdvance: 55100,
  settlementStatusText: 'Balance cash returned to office chest by Mr. Vijayanand Raut ',
  signatory: '(Vijayanand S Raut)',
};
