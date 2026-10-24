# Office Expense Voucher Generator

A Progressive Web App (PWA) to generate office expense vouchers in PDF format. Built with React, TypeScript, Redux Toolkit, and jsPDF.

## Features

- **Easy to Use**: Simple, neutral interface designed for non-technical users
- **Editable Fields**: Update voucher date, narrative, expenditure items, petty cash amounts, and settlement details monthly
- **Automatic Calculations**: Totals and net settlement are calculated automatically
- **PDF Generation**: Generate and download vouchers as PDF files matching the original format
- **PWA Support**: Installable on desktop and mobile devices, works offline
- **Responsive Design**: Works well on both desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Vite** - Build tool
- **jsPDF & html2canvas** - PDF generation
- **Vitest & React Testing Library** - Testing
- **Vite PWA Plugin** - Progressive Web App features

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Open the app in your browser
2. Edit the fields in the form on the left:
   - **Header Details**: Update the voucher date
   - **Narrative Text**: Edit the description paragraph
   - **Expenditure Details**: Add/remove/edit expense items and amounts
   - **Settlement**: Update petty cash advance and settlement status
3. Preview the voucher on the right side
4. Click "Download PDF" to generate and download the PDF

## Field Classification

### Monthly Updateable Fields
- Voucher Date (DD/MM/YYYY)
- Narrative/Description text
- Expenditure items (subjects and amounts)
- Petty Cash Advance amount
- Settlement Status text

### Auto-Calculated
- Total Expense Incurred
- Net Settlement Amount
- Absolute Settlement Amount

## Testing

This project follows Test-Driven Development (TDD) principles. Unit tests cover:
- Calculation utilities (total, net settlement, formatting)
- Redux slice reducers and actions
- All business logic is pure functions where possible

## License

Private
