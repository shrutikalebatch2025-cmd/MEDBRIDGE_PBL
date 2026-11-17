import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const ReceiptsPage: React.FC = () => {
  const { receipts, setActiveReceiptModal, generateSampleReceipt } = useMedBridge();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'donation_tax_exempt' | 'consignment_handover'>('all');

  const filtered = receipts.filter((r) => {
    if (!r) return false;
    const matchesType = filterType === 'all' || r.receiptType === filterType;
    const q = search.trim().toLowerCase();
    const receiptNum = (r.receiptNumber || '').toLowerCase();
    const donorOrg = (r.donor?.organization || r.donor?.name || '').toLowerCase();
    const ngoOrg = (r.ngo?.organization || r.ngo?.name || '').toLowerCase();
    const items = r.items || [];
    const itemMatch = items.some(
      (i) =>
        (i?.name || '').toLowerCase().includes(q) ||
        (i?.serialNumber || '').toLowerCase().includes(q) ||
        (i?.category || '').toLowerCase().includes(q)
    );

    const matchesSearch =
      !q ||
      receiptNum.includes(q) ||
      donorOrg.includes(q) ||
      ngoOrg.includes(q) ||
      itemMatch;

    return matchesType && matchesSearch;
  });

  const totalCertifiedValue = receipts.reduce((sum, r) => sum + (r?.totalValue || 0), 0);

  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%]">
      {/* Page Header with Action Buttons */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
            AUDITED LEDGER
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-2">
            Verified E-Receipts Archive
          </h1>
          <p className="text-[#6b8499] text-base max-w-2xl">
            All equipment donations and clinic consignments generate official, cryptographic e-receipts with Section 80G / 501(c)(3) tax exemption eligibility and QR traceability.
          </p>
        </div>

        {/* Instant Receipt Generator Actions */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => generateSampleReceipt('donation_tax_exempt')}
            className="py-2.5 px-4 rounded-[9px] bg-[#079669] hover:bg-[#067a55] text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs flex items-center gap-1.5"
            title="Generate a 501(c)(3) / 80G Tax Exemption Certificate"
          >
            <span>+ New Tax E-Receipt</span>
          </button>
          <button
            type="button"
            onClick={() => generateSampleReceipt('consignment_handover')}
            className="py-2.5 px-4 rounded-[9px] bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs flex items-center gap-1.5"
            title="Generate an Equipment Consignment & Handover Receipt"
          >
            <span>+ New Handover E-Receipt</span>
          </button>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-5 shadow-2xs">
          <span className="text-xs text-[#6b8499] block font-medium">Total E-Receipts Issued</span>
          <span className="text-2xl font-bold font-mono text-[#087fc1]">
            {receipts.length} Certificates
          </span>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-5 shadow-2xs">
          <span className="text-xs text-[#6b8499] block font-medium">Total Certified Equipment Value</span>
          <span className="text-2xl font-bold font-mono text-[#079669]">
            ₹{totalCertifiedValue.toLocaleString('en-IN')} INR
          </span>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-5 shadow-2xs">
          <span className="text-xs text-[#6b8499] block font-medium">Verification Protocol</span>
          <span className="text-2xl font-bold text-[#173b5d]">
            SHA-256 Ledger
          </span>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="bg-white border border-[#dce7ee] rounded-[15px] p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by receipt #, equipment, serial #, or organization..."
          className="w-full sm:flex-1 border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-2.5 text-xs sm:text-sm text-[#173b5d] outline-none focus:border-[#087fc1]"
        />

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-[7px] text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-[#173b5d] text-white'
                : 'bg-[#e8f2f7] text-[#173b5d] hover:bg-[#d9e9f2]'
            }`}
          >
            All ({receipts.length})
          </button>
          <button
            onClick={() => setFilterType('donation_tax_exempt')}
            className={`px-3 py-1.5 rounded-[7px] text-xs font-bold transition-colors ${
              filterType === 'donation_tax_exempt'
                ? 'bg-[#079669] text-white'
                : 'bg-[#e8f2f7] text-[#173b5d] hover:bg-[#d9e9f2]'
            }`}
          >
            Tax Exemption (Donors)
          </button>
          <button
            onClick={() => setFilterType('consignment_handover')}
            className={`px-3 py-1.5 rounded-[7px] text-xs font-bold transition-colors ${
              filterType === 'consignment_handover'
                ? 'bg-[#087fc1] text-white'
                : 'bg-[#e8f2f7] text-[#173b5d] hover:bg-[#d9e9f2]'
            }`}
          >
            Handover (NGOs)
          </button>
        </div>
      </section>

      {/* Receipts List */}
      <section className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#dce7ee] rounded-[15px] p-10 text-center max-w-md mx-auto shadow-2xs">
            <h3 className="text-lg font-bold text-[#173b5d]">No E-Receipts Found</h3>
            <p className="text-[#6b8499] text-sm mt-1">
              Add items to your cart and complete a requisition, or list equipment as a donor to issue certificates.
            </p>
          </div>
        ) : (
          filtered.map((receipt) => {
            const isTax = receipt.receiptType === 'donation_tax_exempt';

            return (
              <div
                key={receipt.receiptNumber}
                onClick={() => setActiveReceiptModal(receipt)}
                className="bg-white border border-[#dce7ee] hover:border-[#087fc1] rounded-[14px] p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        isTax
                          ? 'bg-[#e8f8f2] text-[#079669]'
                          : 'bg-[#eef8fd] text-[#087fc1]'
                      }`}
                    >
                      {isTax ? 'Section 80G / 501(c)(3) Tax Exemption' : 'Equipment Consignment & Handover'}
                    </span>
                    <span className="font-mono font-bold text-[#173b5d]">
                      {receipt.receiptNumber}
                    </span>
                    <span className="text-[#6b8499]">·</span>
                    <span className="text-[#6b8499]">
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#173b5d] truncate">
                    {(receipt.items || []).map((i) => i.name).join(', ') || 'Certified Medical Consignment'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b8499]">
                    <span>Donor: <strong className="text-[#173b5d]">{receipt.donor?.organization || receipt.donor?.name || 'Verified Donor'}</strong></span>
                    <span>NGO / Clinic: <strong className="text-[#173b5d]">{receipt.ngo?.organization || receipt.ngo?.name || 'Recipient Clinic'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#dce7ee]">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-[#6b8499] block">Total Certified Value</span>
                    <span className="text-base font-mono font-bold text-[#079669]">
                      ₹{(receipt.totalValue ?? 0).toLocaleString('en-IN')} INR
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReceiptModal(receipt);
                    }}
                    className="py-2 px-3.5 bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-xs rounded-[7px] transition-colors shadow-2xs"
                  >
                    View & Print Receipt
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
};
