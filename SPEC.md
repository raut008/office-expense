# Office Expense Voucher PWA - Specification

## Overview
A Progressive Web App (PWA) to generate office expense vouchers in PDF format, similar to the Soma Textile & Industries Limited voucher. The app should be simple and usable by non-technical users aged 60, with a neutral tone throughout.

## Goals
- Generate PDF vouchers matching the layout of the existing voucher
- Allow monthly updates to dynamic fields
- Follow Test-Driven Development (TDD) approach with unit tests
- Use React with Redux Toolkit (if necessary)
- Use an external package for PDF creation
- PWA capabilities for offline use/installability
- Neutral, simple UI suitable for elderly non-technical users

## Voucher Layout Analysis

### Static/Header Fields (Rarely change)
- Company Name: "SOMA TEXTILE & INDUSTRIES LIMITED"
- Address: "5/B, Bhaktawar, NARIMAN POINT, MUMBAI 400 021"
- Voucher Title: "OFFICE EXPENSES VOUCHER"
- Signatory: "(Vijayanand S Raut)"
- Signature label

### Dynamic/Monthly Updateable Fields

#### Date & Narrative
- Voucher Date: `DATE:-DD/MM/YYYY` (e.g., 28/09/2026) - changes monthly
- Narrative/Description paragraph: Contains details about petty cash withdrawals, amounts given/received, dates. This text changes monthly based on transactions.

#### Expenditure Details Table
| Sr. No. | Subject | Amount (Rs.) |
|---------|---------|--------------|
| 1 | Balance Reimbursement for the month of August for Mr. Vijayanand Raut | Variable (3552) |
| 2 | Travel Expense | Variable (807) |
| 3 | Office Expense | Variable (8997.21) |
| 4 | Electrical Items | Variable (500) |
| 5 | Snacks and Pantry Expense | Variable (7895.79) |
| 6 | Courier Charges | Variable (364) |
| 7 | Consumer Charges | Variable (14095) |
| | **Total Expense Incurred** | Calculated/Sum (36211) |

All line items and their amounts can change monthly. The "month" in item 1 description may also change.

#### Settlement and Net Payout Summary
| Row Label | Description | Calculation/Value |
|-----------|-------------|-------------------|
| Petty Cash Advance Issued | Amount Drawn from Bank/Office Cash | Variable (55100) |
| Total Expense Incurred | Total from Expenditure Details from above table | Auto-calculated from expenditure table |
| Net Settlement Amount | Absolute Difference | Auto-calculated = Petty Cash Advance - Total Expense Incurred (can be negative) |
| Settlement Status | Balance cash returned to office chest by Mr. Vijayanand Raut / Amount to be received | Shows the absolute/net balance with appropriate text |

The settlement status text may need adjustment based on whether money is returned or received.

## Field Classification

### User-Editable (Monthly)
1. **voucherDate** (string, DD/MM/YYYY format) - Voucher date
2. **narrativeText** (string, multiline) - The paragraph describing transactions
3. **expenditureItems** (array of objects)
   - Each with: `srNo`, `subject`, `amount` (number)
   - Subjects can be edited/added/removed as needed
   - Month references in subjects should be editable
4. **pettyCashAdvance** (number) - Amount drawn
5. **settlementStatusText** (string) - Text describing settlement (can be customized)

### Auto-Calculated (Read-only/Derived)
1. **totalExpenseIncurred** = sum of all expenditureItems.amount
2. **netSettlementAmount** = pettyCashAdvance - totalExpenseIncurred
3. **settlementAmountDisplay** = Math.abs(netSettlementAmount)

### Fixed/Configurable but rarely changed
1. Company details (header)
2. Signatory name

## UI/UX Requirements
- **Neutral tone**: Use simple, clear language. Avoid technical jargon.
- **Elderly-friendly**: Large fonts (minimum 16px base), clear buttons, good contrast, simple forms
- **Mobile-first & PWA-optimized**: Fully responsive design optimized for mobile devices since it's a PWA. Touch-friendly controls with adequate tap targets (minimum 44x44px)
- **Mobile Navigation**: On mobile, use tabbed interface (Form / Preview) or collapsible sections for easy navigation
- **Step by step or single form**: Keep it simple - maybe a single page form with clear sections
- **Input validation**: Validate numbers, dates
- **Preview**: Show preview of the voucher before generating PDF, optimized for mobile viewing
- **PDF Generation**: One-click generate and download PDF, works well on mobile browsers
- **PWA**: Installable, works offline after first load, optimized for mobile home screen
- **Responsive breakpoints**: Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)
- **Viewport optimized**: Proper meta viewport, no horizontal scrolling on mobile
- **Touch interactions**: All buttons and inputs easily tappable on small screens

## Technical Requirements

### Tech Stack
- **Framework**: React (with Vite or Create React App)
- **State Management**: Redux Toolkit (use if complex state needed; form state might be local or in Redux)
- **PDF Creation**: External package (e.g., `jspdf` with `html2canvas`, or `pdfmake`, or `@react-pdf/renderer`)
- **Testing**: Vitest/Jest with React Testing Library, follow TDD
- **PWA**: Vite PWA plugin or CRA PWA template

### Architecture
```
src/
├── components/        # UI components
│   ├── forms/        # Form sections for editing
│   ├── preview/      # Voucher preview
│   └── common/       # Shared components
├── store/            # Redux store and slices
│   └── voucherSlice.ts
├── utils/            # Utilities
│   ├── calculations.ts  # Pure functions for calculations
│   └── pdfGenerator.ts  # PDF generation logic
├── tests/            # Unit tests
└── App.tsx
```

### Data Model
```typescript
interface ExpenditureItem {
  id: string;
  srNo: number;
  subject: string;
  amount: number;
}

interface VoucherData {
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
```

### Calculations (Pure Functions - Must be Unit Tested)
- `calculateTotalExpense(items: ExpenditureItem[]): number`
- `calculateNetSettlement(pettyCashAdvance: number, totalExpense: number): number`
- `formatCurrency(amount: number): string`

## Testing Strategy (TDD)
1. Write tests first for calculations
2. Write tests for reducers/actions
3. Write tests for components
4. Implement to make tests pass
5. Aim for good coverage on business logic

## PDF Generation
- Must closely match the layout and formatting of the original voucher
- Preserve tables, alignment, fonts
- Handle multi-line text in narrative
- Show Rupee symbol (₹)
- Proper spacing

## Acceptance Criteria
- [ ] User can edit all monthly updateable fields
- [ ] Calculations update automatically
- [ ] PDF generated matches the structure of original voucher
- [ ] App is installable as PWA
- [ ] All unit tests pass
- [ ] UI is simple and neutral, suitable for non-technical elderly user
- [ ] Works on mobile and desktop
- [ ] Fully mobile-friendly with responsive design
- [ ] Touch-friendly controls on mobile devices (min 44x44px tap targets)
- [ ] No horizontal scrolling on mobile screens
- [ ] Optimized for PWA use on mobile devices
- [ ] Expenditure details section has good mobile viewing experience with card-based layout

## Notes
- "eternal package" - will use a reliable external PDF package like `jspdf` and `html2canvas` (commonly used). If "eternal" refers to a specific internal/package name not on npm, we may need to clarify, but proceeding with standard packages.
