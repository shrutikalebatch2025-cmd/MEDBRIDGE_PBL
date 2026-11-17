import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, checkoutCart, showPage, currentUser, generateSampleReceipt } = useMedBridge();

  const [clinicBranch, setClinicBranch] = useState(
    currentUser?.organization || 'St. Jude Community Outreach Clinic (Ward 7)'
  );
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Critical Emergency'>('Urgent');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Equipment package required for patient triage and outpatient diagnostic expansion in our underserved facility.'
  );

  const totalValue = cart.reduce(
    (acc, cur) => acc + (cur.equipment.estimated_value || 48000) * cur.quantityRequested,
    0
  );

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    checkoutCart({
      clinicBranch,
      urgency,
      clinicalNotes,
    });
  };

  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%]">
      {/* Page Header */}
      <section className="mb-8">
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          REQUISITION CART
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-2">
          Equipment Request Cart
        </h1>
        <p className="text-[#6b8499] text-base">
          Assemble multiple medical devices into a unified consignment package and generate an official custody handoff e-receipt.
        </p>
      </section>

      {cart.length === 0 ? (
        <div className="max-w-[700px] mx-auto bg-white rounded-[20px] p-12 text-center border border-[#dce7ee] shadow-sm">
          <div className="text-5xl text-[#087fc1] mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-[#173b5d] mb-2">
            Your Request Cart is Empty
          </h2>
          <p className="text-[#6b8499] text-sm mb-6 max-w-sm mx-auto">
            Browse the available medical equipment catalog and add devices required for your clinic or hospital facility.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => showPage('equipment')}
              className="py-3 px-6 rounded-[9px] bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-sm transition-colors"
            >
              Explore Equipment Catalog
            </button>
            <button
              onClick={() => generateSampleReceipt('consignment_handover')}
              className="py-3 px-6 rounded-[9px] bg-[#e8f8f2] hover:bg-[#d1f2e4] text-[#079669] border border-[#a2dfc8] font-bold text-sm transition-colors"
            >
              🧾 Test Sample E-Receipt
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dce7ee]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173b5d]">
                Selected Equipment Items ({cart.length})
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#dc3545] font-bold hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-3">
              {cart.map((cartItem) => {
                const item = cartItem.equipment;
                const itemVal = (item.estimated_value || 48000) * cartItem.quantityRequested;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#dce7ee] rounded-[15px] p-4 flex gap-4 items-center justify-between shadow-2xs"
                  >
                    <div className="w-16 h-16 rounded-[10px] bg-[#eaf6fc] overflow-hidden flex items-center justify-center shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/equipment/patient_monitor.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl text-[#087fc1] font-bold">+</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-bold text-[#173b5d] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6b8499] mt-0.5">
                        {item.category} · {item.condition} · Location: {item.location}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#079669] mt-1.5 inline-flex items-center gap-1.5 bg-[#e8f8f2] px-2.5 py-1 rounded-[7px] border border-[#a2dfc8] shadow-2xs">
                        <span>Value : ₹{itemVal.toLocaleString('en-IN')} Indian Rupees</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[#dc3545] hover:bg-[#fff0f1] rounded-lg font-bold text-xs transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={() => showPage('equipment')}
                className="text-xs font-bold text-[#087fc1] hover:underline"
              >
                + Add more items from catalog
              </button>
            </div>
          </div>

          {/* Right Column: Requisition Form & E-Receipt Generator */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCheckout}
              className="bg-white border border-[#dce7ee] rounded-[20px] p-6 sm:p-8 shadow-sm space-y-4 text-xs sm:text-sm"
            >
              <h3 className="text-lg font-bold text-[#173b5d] pb-2 border-b border-[#dce7ee]">
                Requisition & Custody Details
              </h3>

              <div>
                <label className="block font-bold text-[#173b5d] mb-1">
                  Designated Clinic / Hospital Branch *
                </label>
                <input
                  type="text"
                  required
                  value={clinicBranch}
                  onChange={(e) => setClinicBranch(e.target.value)}
                  placeholder="e.g. St. Jude Maternal Health Clinic, Ward 7"
                  className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-2.5 text-[#173b5d] outline-none focus:border-[#087fc1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#173b5d] mb-1">
                  Clinical Priority Level *
                </label>
                <select
                  value={urgency}
                  onChange={(e) =>
                    setUrgency(e.target.value as 'Routine' | 'Urgent' | 'Critical Emergency')
                  }
                  className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-2.5 text-[#173b5d] outline-none focus:border-[#087fc1]"
                >
                  <option value="Critical Emergency">Critical Emergency (Immediate Deploy)</option>
                  <option value="Urgent">Urgent Clinical Need</option>
                  <option value="Routine">Routine Outpatient Expansion</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#173b5d] mb-1">
                  Clinical Purpose & Patient Need *
                </label>
                <textarea
                  rows={3}
                  required
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Describe patient condition or clinical necessity..."
                  className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-2.5 text-[#173b5d] outline-none focus:border-[#087fc1]"
                />
              </div>

              {/* Value Summary */}
              <div className="bg-[#f5fbff] p-4 rounded-[12px] border border-[#dce7ee] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6b8499]">
                  <span>Total Equipment Fair Value:</span>
                  <span className="font-mono font-bold text-[#173b5d]">
                    ₹{totalValue.toLocaleString('en-IN')} INR
                  </span>
                </div>
                <div className="flex justify-between text-[#6b8499]">
                  <span>Humanitarian Donor Subsidy:</span>
                  <span className="text-[#079669] font-bold">100% Fully Donated</span>
                </div>
                <div className="pt-2 border-t border-[#dce7ee] flex justify-between text-sm font-bold text-[#173b5d]">
                  <span>Total Balance Due:</span>
                  <span className="font-mono text-[#087fc1]">₹0.00</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-sm rounded-[9px] transition-colors shadow-sm"
              >
                Submit Requisition & Generate E-Receipt →
              </button>

              <p className="text-[11px] text-[#6b8499] text-center leading-relaxed">
                Generates a cryptographically verified handoff consignment receipt with serial numbers, QR code, and PDF download.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
