import { useState, useEffect } from 'react';
import VoucherForm from './components/forms/VoucherFormWizard';
import VoucherPreview from './components/preview/VoucherPreview';
import { generatePDF } from './utils/pdfGenerator';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import PreviewModal from './components/preview/PreviewModal';
import Toast from './components/common/Toast';
import './App.css';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showInstallSheet, setShowInstallSheet] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const voucherData = useSelector((state: RootState) => state.voucher.data);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [voucherData]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleOpenPreview = () => setShowPreviewModal(true);
    const handleDownloadPdf = () => {
      handleGeneratePDF();
    };
    const handleSharePdf = async () => {
      try {
        setIsGenerating(true);
        await generatePDF(voucherData, 'voucher-preview-hidden');
        showToast('PDF generated', 'success');
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Office Expense Voucher',
              text: `Office Expense Voucher - ${voucherData.voucherDate}`,
            });
          } catch {
            // User cancelled or not supported
          }
        } else {
          const text = encodeURIComponent(`Office Expense Voucher - ${voucherData.voucherDate}`);
          window.open(`https://wa.me/?text=${text}`, '_blank');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Error generating PDF', 'error');
      } finally {
        setIsGenerating(false);
      }
    };
    window.addEventListener('openPreview', handleOpenPreview as EventListener);
    window.addEventListener('downloadPdf', handleDownloadPdf as EventListener);
    window.addEventListener('sharePdf', handleSharePdf as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('openPreview', handleOpenPreview as EventListener);
      window.removeEventListener('downloadPdf', handleDownloadPdf as EventListener);
      window.removeEventListener('sharePdf', handleSharePdf as EventListener);
    };
  }, [voucherData]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setShowInstallSheet(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallSheet(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(voucherData, 'voucher-preview-hidden');
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating PDF. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-indicator">
          ⚠️ You're offline - App still works
        </div>
      )}
      <header className="app-header">
        <div className="app-header-content">
          <h1>
            <svg className="app-header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Office Expense Voucher
          </h1>
          <div className="app-header-actions">
            <button onClick={() => setLargeText(!largeText)} className="header-btn" title="Toggle text size">
              {largeText ? 'A-' : 'A+'}
            </button>
            <button onClick={() => setHighContrast(!highContrast)} className="header-btn" title="Toggle high contrast">
              ◐
            </button>
            {deferredPrompt && (
              <button onClick={() => setShowInstallSheet(true)} className="header-btn header-btn-install" title="Install app">
                📱 Install
              </button>
            )}
            {draftSaved && (
              <span className="draft-saved-indicator">✓ Draft saved</span>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="form-section-container">
          <VoucherForm />
        </section>
      </main>



      {showInstallSheet && (
        <div className="install-sheet-overlay" onClick={() => setShowInstallSheet(false)}>
          <div className="install-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="install-sheet-header">
              <h3>Add to Home Screen</h3>
              <button onClick={() => setShowInstallSheet(false)} className="install-sheet-close">×</button>
            </div>
            <div className="install-sheet-body">
              <p>Install this app on your device for quick access and offline use.</p>
              <ul>
                <li>✓ Works offline</li>
                <li>✓ Faster access</li>
                <li>✓ App-like experience</li>
              </ul>
            </div>
            <div className="install-sheet-footer">
              <button onClick={() => setShowInstallSheet(false)} className="install-sheet-btn install-sheet-btn-cancel">Cancel</button>
              <button onClick={handleInstallClick} className="install-sheet-btn install-sheet-btn-install">Install</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <VoucherPreview id="voucher-preview-hidden" />
      </div>

      <div className="mobile-sticky-bar">
      </div>

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onShowToast={showToast}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
