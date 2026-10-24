import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  updateVoucherDate,
  updateNarrativeText,
  updatePettyCashAdvance,
  updateSettlementStatusText,
  addExpenditureItem,
  removeExpenditureItem,
  updateExpenditureItem,
  resetVoucher,
} from '../../store/voucherSlice';
import { calculateNetSettlement, formatCurrency } from '../../utils/calculations';
import './VoucherForm.css';

const VoucherForm = () => {
  const dispatch = useDispatch();
  const { data, totalExpense } = useSelector((state: RootState) => state.voucher);
  const netSettlement = calculateNetSettlement(data.pettyCashAdvance, totalExpense);
  const settlementAmount = Math.abs(netSettlement);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default? This will clear all your changes.')) {
      dispatch(resetVoucher());
    }
  };

  const handleRemoveItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this expense item?')) {
      dispatch(removeExpenditureItem(id));
    }
  };

  return (
    <div className="voucher-form">
      <div className="form-card-header">
        <h2 className="form-card-title">Voucher Details</h2>
        <p className="form-card-subtitle">Fill in the details below to generate and download your PDF voucher</p>
      </div>

      <section className="form-section">
        <h2 className="section-heading">Header Details</h2>
        <div className="form-group">
          <label htmlFor="voucherDate">Voucher Date</label>
          <input
            id="voucherDate"
            type="text"
            inputMode="numeric"
            value={data.voucherDate}
            onChange={(e) => dispatch(updateVoucherDate(e.target.value))}
            placeholder="DD/MM/YYYY"
            className="form-input"
          />
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-heading">Narrative Text</h2>
        <div className="form-group">
          <label htmlFor="narrative">Description</label>
          <textarea
            id="narrative"
            value={data.narrativeText}
            onChange={(e) => dispatch(updateNarrativeText(e.target.value))}
            rows={4}
            className="form-textarea"
          />
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-heading">Expenditure Details</h2>
        <p className="section-help">Add or edit expense items below</p>
        {data.expenditureItems.map((item) => (
          <div key={item.id} className="expense-card">
            <div className="expense-card-header">
              <span className="expense-card-number">Item {item.srNo}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="expense-card-remove"
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
            <div className="expense-card-body">
              <div className="expense-field">
                <label className="expense-label">Description / Subject</label>
                <input
                  type="text"
                  value={item.subject}
                  onChange={(e) => dispatch(updateExpenditureItem({ id: item.id, field: 'subject', value: e.target.value }))}
                  className="expense-input"
                  placeholder="Enter expense description"
                />
              </div>
              <div className="expense-field">
                <label className="expense-label">Amount (Rupees)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={item.amount}
                  onChange={(e) => dispatch(updateExpenditureItem({ id: item.id, field: 'amount', value: e.target.value }))}
                  className="expense-input expense-input-amount"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => {
          dispatch(addExpenditureItem());
          setTimeout(() => {
            const cards = document.querySelectorAll('.expense-card');
            if (cards.length > 0) {
              cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
        }} className="btn-add-expense">
          + Add New Expense Item
        </button>
        <div className="expense-total">
          <span>Total Expense Incurred:</span>
          <strong>₹{formatCurrency(totalExpense)}</strong>
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-heading">Settlement</h2>
        <div className="form-group">
          <label htmlFor="pettyCash">Petty Cash Advance Issued (₹)</label>
          <input
            id="pettyCash"
            type="number"
            inputMode="decimal"
            value={data.pettyCashAdvance}
            onChange={(e) => dispatch(updatePettyCashAdvance(parseFloat(e.target.value) || 0))}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="settlementText">Settlement Description (Optional)</label>
          <input
            id="settlementText"
            type="text"
            value={data.settlementStatusText}
            onChange={(e) => dispatch(updateSettlementStatusText(e.target.value))}
            className="form-input"
            placeholder="Leave blank for auto-calculation"
          />
        </div>
        <div className="settlement-info">
          <div>Net Settlement: <strong>{netSettlement >= 0 ? '+' : ''}{formatCurrency(netSettlement)}</strong></div>
          <div>
            {netSettlement > 0 && <span>Amount <strong>₹{formatCurrency(settlementAmount)}</strong> to be returned to Office Chest</span>}
            {netSettlement < 0 && <span>Amount <strong>₹{formatCurrency(settlementAmount)}</strong> to be returned to Mr. Vijayanand Raut</span>}
            {netSettlement === 0 && <span><strong>Settlement is balanced out</strong></span>}
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button type="button" onClick={handleReset} className="btn-reset">
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default VoucherForm;
