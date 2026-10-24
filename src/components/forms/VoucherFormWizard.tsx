import { useState } from 'react';
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

const steps = [
  { id: 1, title: 'Header & Narrative', description: 'Date and description' },
  { id: 2, title: 'Expenditure Details', description: 'Add expenses' },
  { id: 3, title: 'Settlement', description: 'Cash and balance' },
];

const VoucherForm = () => {
  const dispatch = useDispatch();
  const { data, totalExpense } = useSelector((state: RootState) => state.voucher);
  const netSettlement = calculateNetSettlement(data.pettyCashAdvance, totalExpense);
  const settlementAmount = Math.abs(netSettlement);
  const [currentStep, setCurrentStep] = useState(1);

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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="voucher-form">
      <div className="form-card-header">
        <div className="form-card-header-top">
          <div>
            <h2 className="form-card-title">Create Voucher</h2>
            <p className="form-card-subtitle">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
          </div>
          <div className="form-header-actions">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('openPreview');
                window.dispatchEvent(event);
              }}
              className="form-header-btn form-header-btn-icon"
              title="Preview"
              aria-label="Preview"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('downloadPdf');
                window.dispatchEvent(event);
              }}
              className="form-header-btn form-header-btn-icon"
              title="Download PDF"
              aria-label="Download PDF"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('sharePdf');
                window.dispatchEvent(event);
              }}
              className="form-header-btn form-header-btn-icon"
              title="Share"
              aria-label="Share"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="wizard-steps-wrapper">
        <div className="wizard-progress-line"></div>
        <div className="wizard-steps">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`wizard-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="wizard-step-circle">{step.id}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="wizard-step-header">
        <div className="wizard-step-header-title">{steps[currentStep - 1].title}</div>
        <div className="wizard-step-header-desc">{steps[currentStep - 1].description}</div>
      </div>

      {currentStep === 1 && (
        <>
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
        </>
      )}

      {currentStep === 2 && (
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
          <div className="sticky-total-bar">
            <span>Total Expense Incurred:</span>
            <strong>₹{formatCurrency(totalExpense)}</strong>
          </div>
        </section>
      )}

      {currentStep === 3 && (
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
      )}

      <div className="wizard-navigation">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="wizard-btn wizard-btn-back"
        >
          ← Back
        </button>
        {currentStep < steps.length ? (
          <button type="button" onClick={nextStep} className="wizard-btn wizard-btn-next">
            Next →
          </button>
        ) : (
          <button type="button" onClick={handleReset} className="wizard-btn wizard-btn-reset">
            Reset to Default
          </button>
        )}
      </div>
    </div>
  );
};

export default VoucherForm;
