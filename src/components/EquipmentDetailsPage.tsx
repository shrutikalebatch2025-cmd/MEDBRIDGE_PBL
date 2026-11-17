import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const EquipmentDetailsPage: React.FC = () => {
  const {
    selectedEquipment,
    showPage,
    currentUser,
    openRequest,
    addToCart,
    cart,
    generateTaxReceiptForDonorItem,
    openReceiptForEquipment,
  } = useMedBridge();

  if (!selectedEquipment) {
    return (
      <main className="p-12 text-center">
        <button
          onClick={() => showPage('equipment')}
          className="text-[#087fc1] font-bold text-sm hover:underline mb-4"
        >
          ← Back to Equipment
        </button>
        <p className="text-[#6b8499]">No equipment selected.</p>
      </main>
    );
  }

  const isDonor = currentUser?.role === 'Donor';
  const isMine =
    currentUser &&
    (selectedEquipment.owner_id === currentUser.id ||
      selectedEquipment.owner_name === currentUser.name ||
      selectedEquipment.owner_organization === currentUser.organization);

  const isInCart = cart.some((c) => c.equipmentId === selectedEquipment.id);

  const ownerName =
    selectedEquipment.owner_organization ||
    selectedEquipment.owner_name ||
    'Equipment Provider';

  return (
    <main className="min-h-[calc(100vh-78px)] py-8 px-[8%]">
      <button
        onClick={() => showPage('equipment')}
        className="text-[#087fc1] font-bold text-sm mb-6 flex items-center gap-1 hover:underline"
      >
        ← Back to Equipment
      </button>

      <div className="max-w-[1000px] mx-auto bg-white rounded-[20px] overflow-hidden border border-[#dce7ee] shadow-sm">
        {/* Real Equipment Photo Banner */}
        <div className="h-64 sm:h-80 w-full bg-[#eaf6fc] overflow-hidden relative">
          {selectedEquipment.image_url ? (
            <img
              src={selectedEquipment.image_url}
              alt={selectedEquipment.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/equipment/patient_monitor.jpg';
              }}

              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#087fc1] text-6xl">
              🏥
            </div>
          )}
          <div className="absolute top-4 right-4 bg-[#173b5d]/90 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-md shadow-xs">
            Estimated Value: ₹{Number(selectedEquipment.estimated_value || 48000).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
            EQUIPMENT DETAILS
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-3">
            {selectedEquipment.name}
          </h1>

          <p className="text-[#6b8499] text-base mb-6">
            Provided by <strong className="text-[#173b5d]">{ownerName}</strong>
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Category</strong>
              <span className="text-sm text-[#6b8499]">{selectedEquipment.category}</span>
            </div>

            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Condition</strong>
              <span className="text-sm text-[#6b8499]">{selectedEquipment.condition}</span>
            </div>

            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Sharing Type</strong>
              <span className="text-sm text-[#6b8499]">{selectedEquipment.sharing_type}</span>
            </div>

            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Quantity</strong>
              <span className="text-sm text-[#6b8499] font-mono">{selectedEquipment.quantity} units</span>
            </div>

            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Location</strong>
              <span className="text-sm text-[#6b8499]">{selectedEquipment.location}</span>
            </div>

            <div className="bg-[#f6fafc] p-4 rounded-[10px]">
              <strong className="block text-xs font-bold text-[#173b5d] mb-1">Estimated Value</strong>
              <span className="text-sm text-[#079669] font-bold font-mono">
                ₹{Number(selectedEquipment.estimated_value || 48000).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        {/* Description */}
        <div className="my-6">
          <strong className="block text-xs font-bold text-[#173b5d] mb-2 uppercase tracking-wider">
            Clinical Description
          </strong>
          <p className="text-[#6b8499] text-base leading-relaxed bg-[#f8fbfd] p-5 rounded-[12px] border border-[#dce7ee]">
            {selectedEquipment.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#dce7ee]">
          {/* NGO / Hospital Request Actions */}
          {currentUser && !isDonor && !isMine && selectedEquipment.status === 'Available' && (
            <>
              <button
                onClick={() => openRequest(selectedEquipment.id)}
                className="py-3.5 px-6 rounded-[9px] bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-sm sm:text-base transition-colors shadow-sm"
              >
                Request This Equipment
              </button>

              <button
                onClick={() => addToCart(selectedEquipment)}
                className={`py-3.5 px-6 rounded-[9px] font-bold text-sm sm:text-base border transition-colors ${
                  isInCart
                    ? 'bg-[#e8f8f2] text-[#079669] border-[#079669]'
                    : 'bg-white text-[#087fc1] border-[#087fc1] hover:bg-[#eef8fd]'
                }`}
              >
                {isInCart ? 'In Request Cart ✓' : '+ Add to Requisition Cart'}
              </button>
            </>
          )}

          {/* Official E-Receipt Button (Available to any user) */}
          <button
            type="button"
            onClick={() => openReceiptForEquipment(selectedEquipment.id)}
            className="py-3.5 px-6 rounded-[9px] bg-[#e8f8f2] hover:bg-[#d1f2e4] text-[#079669] border border-[#a2dfc8] font-bold text-sm sm:text-base transition-colors shadow-xs flex items-center gap-2"
          >
            <span>🧾 View / Generate Official E-Receipt</span>
          </button>

          {/* Donor Owner Actions */}
          {isDonor && isMine && (
            <button
              onClick={() => generateTaxReceiptForDonorItem(selectedEquipment.id)}
              className="py-3.5 px-6 rounded-[9px] bg-[#079669] hover:bg-[#067a55] text-white font-bold text-sm sm:text-base transition-colors shadow-sm"
            >
              Generate Section 80G / 501(c)(3) Tax E-Receipt
            </button>
          )}

          <button
            onClick={() => showPage('equipment')}
            className="py-3.5 px-6 rounded-[9px] bg-[#e7eef4] hover:bg-[#d6e2ec] text-[#173b5d] font-bold text-sm sm:text-base transition-colors"
          >
            Browse Other Equipment
          </button>
        </div>
        </div>
      </div>
    </main>
  );
};
