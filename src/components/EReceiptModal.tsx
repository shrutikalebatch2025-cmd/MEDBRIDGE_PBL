import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { EReceipt } from '../types';

interface EReceiptModalProps {
  receipt: EReceipt;
  onClose: () => void;
}

export const EReceiptModal: React.FC<EReceiptModalProps> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isTaxExempt = receipt.receiptType === 'donation_tax_exempt';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(receipt.qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let y = 16;

      // Header Banner Box
      doc.setFillColor(23, 59, 93);
      doc.rect(margin, y, pageWidth - 2 * margin, 24, 'F');

      // Title & Subtitle
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('MedBridge Medical Equipment Sharing Network', margin + 6, y + 9);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(162, 223, 200);
      doc.text('OFFICIAL VERIFIED HEALTHCARE E-RECEIPT & AUDITED LEDGER', margin + 6, y + 15);
      doc.setTextColor(230, 242, 250);
      doc.text(`Certificate Reference: ${receipt.receiptNumber}`, margin + 6, y + 20);

      y += 28;

      // Document Type Ribbon
      doc.setFillColor(isTaxExempt ? 7 : 8, isTaxExempt ? 150 : 127, isTaxExempt ? 105 : 193);
      doc.roundedRect(margin, y, pageWidth - 2 * margin, 9, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      const typeLabel = isTaxExempt
        ? 'TAX-EXEMPT DONATION CERTIFICATE (SECTION 80G - INCOME TAX ACT)'
        : 'EQUIPMENT CONSIGNMENT & CLINICAL CUSTODY HANDOVER E-RECEIPT';
      doc.text(typeLabel, margin + 4, y + 6);

      y += 14;

      // Meta Data Strip
      doc.setTextColor(23, 59, 93);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('Issuance Date:', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(new Date(receipt.createdAt).toLocaleString('en-IN'), margin + 24, y);

      doc.setTextColor(23, 59, 93);
      doc.setFont('helvetica', 'bold');
      doc.text('Verification Hash:', margin + 80, y);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 80, 95);
      doc.text((receipt.verificationHash || 'SHA-256 Ledger Verified').substring(0, 36), margin + 108, y);

      y += 6;

      // Two Column Boxes: Donor & Recipient NGO
      const colWidth = (pageWidth - 2 * margin - 6) / 2;

      // Donor box
      doc.setFillColor(248, 251, 253);
      doc.setDrawColor(220, 231, 238);
      doc.roundedRect(margin, y, colWidth, 42, 2, 2, 'FD');

      doc.setTextColor(7, 150, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('ORIGINATING DONOR ENTITY', margin + 4, y + 6);

      doc.setTextColor(23, 59, 93);
      doc.setFontSize(10);
      doc.text(receipt.donor?.name || 'Dr. Marcus Vance, MD', margin + 4, y + 12);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(receipt.donor?.organization || 'Apex Biomedical Relief Alliance', margin + 4, y + 17);
      doc.setTextColor(100, 116, 139);
      doc.text(`Tax ID: ${receipt.donor?.taxId || 'PAN: AACTM8821F / 80G'}`, margin + 4, y + 23);
      doc.text(`Location: ${receipt.donor?.location || 'New Delhi Central Depot'}`, margin + 4, y + 28);
      doc.text(`Contact: ${receipt.donor?.email || 'donor@medbridge.health'}`, margin + 4, y + 33);
      doc.text(`Phone: ${receipt.donor?.phone || '+91 98765 43210'}`, margin + 4, y + 38);

      // Recipient NGO box
      const col2X = margin + colWidth + 6;
      doc.setFillColor(248, 251, 253);
      doc.roundedRect(col2X, y, colWidth, 42, 2, 2, 'FD');

      doc.setTextColor(8, 127, 193);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('RECIPIENT NGO / HOSPITAL HUB', col2X + 4, y + 6);

      doc.setTextColor(23, 59, 93);
      doc.setFontSize(10);
      doc.text(receipt.ngo?.name || 'Sarah Chen, RN', col2X + 4, y + 12);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(receipt.ngo?.organization || 'Hope Horizon Health Foundation', col2X + 4, y + 17);
      doc.setTextColor(100, 116, 139);
      doc.text(`Registration: ${receipt.ngo?.registrationNumber || 'NGO Darpan / FCRA'}`, col2X + 4, y + 23);
      doc.text(`Clinic Facility: ${receipt.ngo?.clinicBranch || 'Ward 7 Clinic'}`, col2X + 4, y + 28);
      doc.text(`Location: ${receipt.ngo?.location || 'Maharashtra Regional Depot'}`, col2X + 4, y + 33);
      doc.text(`Phone: ${receipt.ngo?.phone || '+91 98765 43211'}`, col2X + 4, y + 38);

      y += 48;

      // Itemized Table Header
      doc.setFillColor(23, 59, 93);
      doc.rect(margin, y, pageWidth - 2 * margin, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('#', margin + 3, y + 4.5);
      doc.text('EQUIPMENT ITEM & SPECIFICATION', margin + 12, y + 4.5);
      doc.text('CONDITION / SERIAL', margin + 105, y + 4.5);
      doc.text('QTY', margin + 145, y + 4.5);
      doc.text('FAIR VALUE (INR)', margin + 160, y + 4.5);

      y += 7;

      // Table Rows
      (receipt.items || []).forEach((item, index) => {
        doc.setFillColor(index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 251, index % 2 === 0 ? 255 : 253);
        doc.rect(margin, y, pageWidth - 2 * margin, 11, 'F');
        doc.setDrawColor(220, 231, 238);
        doc.line(margin, y + 11, pageWidth - margin, y + 11);

        doc.setTextColor(23, 59, 93);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(String(index + 1), margin + 3, y + 5);

        doc.text((item.name || 'Medical Equipment').substring(0, 48), margin + 12, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Category: ${item.category || 'Diagnostic'}`, margin + 12, y + 9);

        doc.setTextColor(23, 59, 93);
        doc.text(`${item.condition || 'Good'}`, margin + 105, y + 5);
        doc.setFont('courier', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.serialNumber || 'SN-VERIFIED'}`, margin + 105, y + 9);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(23, 59, 93);
        doc.text(String(item.quantity || 1), margin + 148, y + 6);

        const valFormatted = `Rs. ${Number(item.estimatedValue ?? 0).toLocaleString('en-IN')}`;
        doc.setTextColor(7, 150, 105);
        doc.text(valFormatted, margin + 160, y + 6);

        y += 11;
      });

      // Total Row
      doc.setFillColor(240, 248, 253);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
      doc.setDrawColor(23, 59, 93);
      doc.line(margin, y, pageWidth - margin, y);
      doc.line(margin, y + 8, pageWidth - margin, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(23, 59, 93);
      doc.text('TOTAL CERTIFIED FAIR VALUE:', margin + 95, y + 5.5);

      const totalFormatted = `Rs. ${Number(receipt.totalValue ?? 0).toLocaleString('en-IN')} INR`;
      doc.setTextColor(8, 127, 193);
      doc.setFontSize(9.5);
      doc.text(totalFormatted, margin + 155, y + 5.5);

      y += 14;

      // Legal & Tax Statement
      doc.setFillColor(248, 251, 253);
      doc.setDrawColor(220, 231, 238);
      doc.roundedRect(margin, y, pageWidth - 2 * margin, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(23, 59, 93);
      doc.text(
        isTaxExempt
          ? 'STATUTORY TAX EXEMPTION CERTIFICATION (SECTION 80G - INCOME TAX ACT, 1961):'
          : 'CHAIN OF CUSTODY & CLINICAL STERILIZATION WARRANTY:',
        margin + 4,
        y + 5
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const legalText = isTaxExempt
        ? 'This certificate confirms an irrevocable humanitarian in-kind donation of medical equipment to registered healthcare entities. No commercial return was provided. Eligible for deduction under Section 80G of the Indian Income Tax Act.'
        : 'The medical equipment above has undergone clinical inspection, biomedical testing, and sanitization. Custody is legally transferred to the recipient healthcare organization for community patient care delivery.';
      doc.text(doc.splitTextToSize(legalText, pageWidth - 2 * margin - 8), margin + 4, y + 10);

      if (receipt.clinicalNotes) {
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(23, 59, 93);
        doc.text(`Clinical Purpose: ${receipt.clinicalNotes.substring(0, 95)}`, margin + 4, y + 20);
      }

      y += 30;

      // Signatures
      doc.setDrawColor(23, 59, 93);
      doc.line(margin + 5, y + 12, margin + colWidth - 10, y + 12);
      doc.line(col2X + 5, y + 12, col2X + colWidth - 10, y + 12);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(23, 59, 93);
      doc.text(receipt.donorSignatory || 'Dr. Marcus Vance, MD', margin + 6, y + 10);
      doc.text(receipt.ngoSignatory || 'Sarah Chen, RN', col2X + 6, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Donor Authorizing Trustee', margin + 6, y + 16);
      doc.text('Recipient NGO Executive Director', col2X + 6, y + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Verified: ${new Date(receipt.createdAt).toLocaleDateString('en-IN')}`, margin + 6, y + 20);
      doc.text('MedBridge Verified Cryptographic Ledger', col2X + 6, y + 20);

      y += 26;

      // Footer
      doc.setFillColor(240, 246, 250);
      doc.rect(margin, y, pageWidth - 2 * margin, 8, 'F');
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Verification URL: ${receipt.qrPayload || 'https://medbridge.health/verify'}`, margin + 3, y + 5);

      // Download and Save as PDF directly
      doc.save(`${receipt.receiptNumber}.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadText = () => {
    const textData = `
========================================================================
MEDBRIDGE MEDICAL EQUIPMENT SHARING NETWORK
OFFICIAL VERIFIED E-RECEIPT
Receipt Reference: ${receipt.receiptNumber}
Document Type: ${isTaxExempt ? 'Tax-Exempt Donation Certificate (Section 80G / 501c3)' : 'Equipment Consignment & Custody Handover'}
Issuance Date: ${new Date(receipt.createdAt).toLocaleString('en-IN')}
Verification Hash: ${receipt.verificationHash}
========================================================================

DONOR DETAILS:
- Name: ${receipt.donor?.name || 'Verified Healthcare Donor'}
- Organization: ${receipt.donor?.organization || 'Medical Donor Partner'}
- Tax Exemption ID: ${receipt.donor?.taxId || 'PAN: AACTM8821F / 80G'}
- Location: ${receipt.donor?.location || 'New Delhi Central Depot'}
- Contact: ${receipt.donor?.email || 'donor-relations@medbridge.network'}

RECIPIENT NGO / HOSPITAL DETAILS:
- Name: ${receipt.ngo?.name || 'Authorized Clinical Admin'}
- Organization: ${receipt.ngo?.organization || 'Community Healthcare NGO'}
- Registration Number: ${receipt.ngo?.registrationNumber || 'NGO Darpan / FCRA'}
- Target Clinic / Branch: ${receipt.ngo?.clinicBranch || 'Community Outpatient Ward'}
- Location: ${receipt.ngo?.location || 'District Ward 7 Health Center'}

ITEMIZED EQUIPMENT CONSIGNMENT:
${(receipt.items || [])
  .map(
    (item, idx) =>
      `${idx + 1}. [${item.category || 'Medical Device'}] ${item.name || 'Equipment'}
   Condition: ${item.condition || 'Good'} | Serial: ${item.serialNumber || 'SN-VERIFIED'} | Qty: ${item.quantity || 1}
   Declared Value: ₹${(item.estimatedValue ?? 0).toLocaleString('en-IN')} Indian Rupees`
  )
  .join('\n\n')}

TOTAL DECLARED FAIR VALUE: ₹${(receipt.totalValue ?? 0).toLocaleString('en-IN')} Indian Rupees
CLINICAL NOTES: ${receipt.clinicalNotes || 'Verified healthcare consignment.'}

SIGNATORIES:
- Donor Signatory: ${receipt.donorSignatory || 'Dr. Marcus Vance, Chief Medical Donor Officer'}
- NGO Signatory: ${receipt.ngoSignatory || 'Sarah Chen, RN, Executive Clinic Director'}
- Sterilization Verified: ${receipt.sanitizationCertified ? 'YES' : 'NO'}

MedBridge Verification URL:
${receipt.qrPayload}
========================================================================
    `.trim();

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#173b5d]/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-[22px] shadow-2xl border border-[#dce7ee] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-[#dce7ee] bg-[#f8fbfd]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#079669]" />
            <span className="text-xs font-bold text-[#173b5d]">
              Verified E-Receipt Certificate
            </span>
            <span className="text-xs text-[#6b8499]">·</span>
            <span className="text-xs font-mono font-bold text-[#087fc1]">
              {receipt.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Action: Direct Download as PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="py-1.5 px-3.5 rounded-[7px] text-xs font-bold bg-[#079669] hover:bg-[#067a55] text-white transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>{isGeneratingPdf ? '⏳ Generating...' : '📥 Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-[7px] text-xs font-bold bg-[#e8f2f7] hover:bg-[#d9e9f2] text-[#173b5d] transition-colors"
            >
              🖨️ Print
            </button>

            <button
              onClick={handleDownloadText}
              className="py-1.5 px-2.5 rounded-[7px] text-xs font-bold bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] transition-colors"
              title="Download Plain Text Format"
            >
              📄 TXT
            </button>

            <button
              onClick={handleCopyLink}
              className="py-1.5 px-2.5 rounded-[7px] text-xs font-bold bg-[#e8f2f7] hover:bg-[#d9e9f2] text-[#173b5d] transition-colors"
            >
              {copied ? 'Copied! ✓' : '📋 URL'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#6b8499] hover:text-[#173b5d] text-lg font-bold ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable E-Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white receipt-printable text-[#173b5d]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#173b5d]">
            <div>
              <div className="font-agbalumo text-3xl sm:text-4xl text-[#087fc1] leading-none mb-1">
                MedBridge
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#079669]">
                Medical Equipment Sharing Network
              </p>
              <p className="text-xs text-[#6b8499] mt-1">
                Official Healthcare Consignment & Verification Authority
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span
                className={`inline-block px-3 py-1 rounded text-xs font-bold text-white ${
                  isTaxExempt ? 'bg-[#079669]' : 'bg-[#087fc1]'
                }`}
              >
                {isTaxExempt ? 'TAX EXEMPTION E-RECEIPT' : 'CONSIGNMENT HANDOVER E-RECEIPT'}
              </span>
              <div className="font-mono text-base font-bold text-[#173b5d]">
                {receipt.receiptNumber}
              </div>
              <div className="text-xs text-[#6b8499]">
                Issued: {new Date(receipt.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 px-4 bg-[#f8fbfd] border border-[#dce7ee] rounded-[15px] my-5 items-center">
            <div className="md:col-span-9 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#079669]">
                <span>✓ Cryptographically Signed & Audited Ledger Certificate</span>
              </div>
              <div className="text-[11px] font-mono text-[#6b8499] break-all">
                Verification Hash: <span className="font-bold text-[#173b5d]">{receipt.verificationHash}</span>
              </div>
              <p className="text-[11px] text-[#6b8499] leading-snug">
                This digital document confirms legal allocation and certified custody transfer of healthcare equipment on MedBridge.
              </p>
            </div>

            {/* QR Code SVG Matrix */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-[#dce7ee]">
              <div className="w-18 h-18 bg-[#173b5d] p-1.5 rounded flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <rect x="5" y="5" width="28" height="28" fill="white" />
                  <rect x="9" y="9" width="20" height="20" fill="black" />
                  <rect x="13" y="13" width="12" height="12" fill="white" />

                  <rect x="67" y="5" width="28" height="28" fill="white" />
                  <rect x="71" y="9" width="20" height="20" fill="black" />
                  <rect x="75" y="13" width="12" height="12" fill="white" />

                  <rect x="5" y="67" width="28" height="28" fill="white" />
                  <rect x="9" y="71" width="20" height="20" fill="black" />
                  <rect x="13" y="75" width="12" height="12" fill="white" />

                  <rect x="42" y="10" width="8" height="8" fill="white" />
                  <rect x="52" y="18" width="8" height="8" fill="white" />
                  <rect x="40" y="32" width="10" height="10" fill="white" />
                  <rect x="55" y="42" width="8" height="8" fill="white" />
                  <rect x="20" y="45" width="12" height="8" fill="white" />
                  <rect x="70" y="45" width="12" height="8" fill="white" />
                  <rect x="45" y="60" width="12" height="12" fill="white" />
                  <rect x="65" y="65" width="10" height="10" fill="white" />
                  <rect x="80" y="75" width="8" height="8" fill="white" />
                </svg>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#6b8499] mt-1 uppercase">
                Scan to Verify
              </span>
            </div>
          </div>

          {/* Parties: Donor and Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-5">
            <div className="bg-[#f8fbfd] p-4 rounded-[12px] border border-[#dce7ee] space-y-1 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#079669] block">
                Originating Donor Entity
              </span>
              <div className="text-sm font-bold text-[#173b5d]">{receipt.donor?.name || 'Verified Donor'}</div>
              <div className="font-medium text-[#173b5d]">{receipt.donor?.organization || 'Medical Donor Partner'}</div>
              <div className="text-[#6b8499] space-y-0.5 pt-1">
                <div>Tax Exemption ID: <span className="font-mono font-bold text-[#173b5d]">{receipt.donor?.taxId || 'MED-TAX-REG'}</span></div>
                <div>Location: {receipt.donor?.location || 'Designated Regional Center'}</div>
                <div>Contact: {receipt.donor?.email || 'donations@medbridge.network'}</div>
              </div>
            </div>

            <div className="bg-[#f8fbfd] p-4 rounded-[12px] border border-[#dce7ee] space-y-1 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087fc1] block">
                Recipient NGO / Hospital Hub
              </span>
              <div className="text-sm font-bold text-[#173b5d]">{receipt.ngo?.name || 'Executive Director'}</div>
              <div className="font-medium text-[#173b5d]">{receipt.ngo?.organization || 'Recipient Health Center'}</div>
              <div className="text-[#6b8499] space-y-0.5 pt-1">
                <div>Registration Code: <span className="font-mono font-bold text-[#173b5d]">{receipt.ngo?.registrationNumber || 'NGO-HC-REG'}</span></div>
                <div>Designated Facility: {receipt.ngo?.clinicBranch || 'Community Clinic'}</div>
                <div>Location: {receipt.ngo?.location || 'Clinical Service Area'}</div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="my-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6b8499] mb-2">
              Itemized Medical Equipment Inventory
            </h4>
            <div className="overflow-x-auto border border-[#dce7ee] rounded-[12px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fbfd] text-[#173b5d] font-bold border-b border-[#dce7ee]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Equipment Item & Category</th>
                    <th className="py-2.5 px-3">Condition & Serial #</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Fair Market Value (INR ₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce7ee] text-[#173b5d]">
                  {(receipt.items || []).map((it, idx) => (
                    <tr key={idx} className="hover:bg-[#fbfdfe]">
                      <td className="py-2.5 px-3 font-mono text-[#6b8499]">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#173b5d]">{it.name || 'Medical Equipment'}</div>
                        <div className="text-[11px] text-[#087fc1]">{it.category || 'Diagnostic'}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div>{it.condition || 'Inspected Good'}</div>
                        <div className="font-mono text-[11px] text-[#6b8499]">{it.serialNumber || 'SN-VERIFIED'}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{it.quantity || 1}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#079669]">
                        ₹{(it.estimatedValue ?? 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#f8fbfd] font-bold text-[#173b5d] border-t-2 border-[#173b5d]">
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-right text-xs uppercase">
                      Total Certified Fair Value:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm font-bold text-[#087fc1]">
                      ₹{(receipt.totalValue ?? 0).toLocaleString('en-IN')} INR
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Legal Certification Statement */}
          <div className="my-5 p-4 rounded-[12px] bg-[#f8fbfd] border border-[#dce7ee] text-xs text-[#6b8499] space-y-1">
            <h5 className="font-bold text-[#173b5d] uppercase text-[11px]">
              {isTaxExempt
                ? 'Charitable Contribution Certification (80G & 501c3)'
                : 'Medical Handoff, Chain-of-Custody & Sterilization Warranty'}
            </h5>
            <p className="leading-relaxed text-[11px]">
              {isTaxExempt
                ? 'This receipt acknowledges a charitable in-kind donation of medical equipment to verified non-profit healthcare entities. No commercial goods or services were provided in return. Eligible for tax deductibility under Section 80G of the Indian Income Tax Act and international non-profit healthcare standards.'
                : 'The equipment listed above has been inspected, sanitized according to clinical bio-safety protocols, and transferred into the official custody of the recipient organization for patient healthcare delivery.'}
            </p>
            {receipt.clinicalNotes && (
              <p className="text-[11px] text-[#173b5d] pt-1 italic border-t border-[#dce7ee]">
                Clinical Purpose: {receipt.clinicalNotes}
              </p>
            )}
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-[#dce7ee] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-2">
              <div className="h-9 border-b border-[#173b5d] flex items-end font-serif italic text-sm text-[#173b5d]">
                {receipt.donorSignatory}
              </div>
              <div>
                <span className="block font-bold text-[#173b5d]">Donor Entity Authorization</span>
                <span className="text-[11px] text-[#6b8499]">
                  Date: {new Date(receipt.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-9 border-b border-[#173b5d] flex items-end font-serif italic text-sm text-[#173b5d]">
                {receipt.ngoSignatory}
              </div>
              <div>
                <span className="block font-bold text-[#173b5d]">Recipient NGO Executive Officer</span>
                <span className="text-[11px] text-[#6b8499]">
                  MedBridge Blockchain Ledger Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Close */}
        <div className="no-print p-4 border-t border-[#dce7ee] bg-[#f8fbfd] flex items-center justify-between">
          <span className="text-xs text-[#079669] font-bold">
            ✓ Ready for download or printing
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-[#173b5d] hover:bg-[#0f2840] text-white font-bold text-xs rounded-[7px] transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
