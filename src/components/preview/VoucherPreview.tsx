import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { calculateNetSettlement, formatCurrency } from '../../utils/calculations';
import './VoucherPreview.css';

interface VoucherPreviewProps {
  id?: string;
}

const VoucherPreview = ({ id = 'voucher-preview' }: VoucherPreviewProps) => {
  const { data, totalExpense } = useSelector((state: RootState) => state.voucher);
  const netSettlement = calculateNetSettlement(data.pettyCashAdvance, totalExpense);
  const settlementAmount = Math.abs(netSettlement);

  const getSettlementDescription = () => {
    if (netSettlement > 0) {
      return 'Balance cash returned to office chest by Mr. Vijayanand Raut';
    } else if (netSettlement < 0) {
      return 'Amount to be returned to Mr. Vijayanand Raut';
    } else {
      return 'Settlement is balanced out';
    }
  };

  const settlementDescription = data.settlementStatusText && data.settlementStatusText.trim()
    ? data.settlementStatusText
    : getSettlementDescription();

  return (
    <div id={id} className="voucher-preview">
      <div className="voucher-blue-header">
        <div className="company-name">{data.companyName}</div>
        <hr className="blue-header-divider" />
        <div className="company-address">{data.companyAddress}</div>
      </div>

      <div className="voucher-date">DATE:- {data.voucherDate}</div>

      <div className="voucher-title">{data.voucherTitle}</div>

      <div className="voucher-narrative">
        {data.narrativeText}
      </div>

      <div className="section-title-bar">Expenditure Details</div>
      <table className="expenditure-table">
        <thead>
          <tr>
            <th className="col-sr">Sr. No.</th>
            <th className="col-subject">Subject</th>
            <th className="col-amount">Amount<br />Rs.</th>
          </tr>
        </thead>
        <tbody>
          {data.expenditureItems.map((item) => (
            <tr key={item.id}>
              <td className="col-sr">{item.srNo}.</td>
              <td className="col-subject">{item.subject}</td>
              <td className="col-amount">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={2} className="total-label">Total Expense Incurred</td>
            <td className="col-amount">{formatCurrency(totalExpense)}</td>
          </tr>
        </tbody>
      </table>

      <div className="section-title-bar">Settlement and Net Payout Summary</div>
      <table className="settlement-table">
        <thead>
          <tr>
            <th>Row Label</th>
            <th>Description</th>
            <th>Calculation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Petty Cash Advance Issued</td>
            <td>Amount Drawn from Bank/Office Cash</td>
            <td>{formatCurrency(data.pettyCashAdvance)}</td>
          </tr>
          <tr>
            <td>Total Expense Incurred</td>
            <td>Total from Expenditure Details from above table</td>
            <td>{formatCurrency(totalExpense)}</td>
          </tr>
          <tr>
            <td>Settlement Status</td>
            <td>{settlementDescription}</td>
            <td>{formatCurrency(settlementAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="signature-section">
        <div className="signature-line">Signature</div>
        <div className="signatory">{data.signatory}</div>
      </div>
    </div>
  );
};

export default VoucherPreview;
