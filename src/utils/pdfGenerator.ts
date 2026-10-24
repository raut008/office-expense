import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VoucherData } from '../types/voucher';

export async function generatePDF(voucherData: VoucherData, elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    // Try to find any voucher preview element
    const allPreviews = document.querySelectorAll('.voucher-preview');
    if (allPreviews.length === 0) {
      throw new Error('Voucher preview element not found');
    }
    const canvas = await html2canvas(allPreviews[allPreviews.length - 1] as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    // ... rest of code
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Office_Expense_Voucher_${voucherData.voucherDate.replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Fit to single page if possible
  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  } else {
    // Scale to fit single page
    const scale = pageHeight / imgHeight;
    const scaledWidth = imgWidth * scale;
    const scaledHeight = pageHeight;
    const xOffset = (imgWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, scaledHeight);
  }

  const fileName = `Office_Expense_Voucher_${voucherData.voucherDate.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}

export function getSettlementDisplay(netSettlement: number): { amount: number; isReturn: boolean } {
  return {
    amount: Math.abs(netSettlement),
    isReturn: netSettlement >= 0,
  };
}
