import { useEffect } from 'react';
import VoucherPreview from './VoucherPreview';
import { generatePDF } from '../../utils/pdfGenerator';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './PreviewModal.css';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const PreviewModal = ({ isOpen, onClose, onShowToast }: PreviewModalProps) => {
  const voucherData = useSelector((state: RootState) => state.voucher.data);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      await generatePDF(voucherData, 'voucher-preview-modal');
      onShowToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      onShowToast('Error generating PDF. Please try again.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h2>Voucher Preview</h2>
          <button className="preview-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="preview-modal-body">
          <div className="preview-modal-scroll">
            <VoucherPreview id="voucher-preview-modal" />
          </div>
        </div>
        <div className="preview-modal-footer">
          <button className="preview-modal-btn preview-modal-btn-close" onClick={onClose}>
            Close
          </button>
          <button className="preview-modal-btn preview-modal-btn-download" onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
