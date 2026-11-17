import React from 'react';
import { Equipment } from '../types';
import { useMedBridge } from '../context/MedBridgeContext';

interface EquipmentCardProps {
  item: Equipment;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ item }) => {
  const {
    currentUser,
    showDetails,
    openRequest,
    deleteEquipment,
    addToCart,
    cart,
    generateTaxReceiptForDonorItem,
    openReceiptForEquipment,
  } = useMedBridge();

  const isMine =
    currentUser &&
    (item.owner_id === currentUser.id ||
      item.owner_name === currentUser.name ||
      item.owner_organization === currentUser.organization);

  const isDonor = currentUser?.role === 'Donor';
  const isInCart = cart.some((c) => c.equipmentId === item.id);

  const statusClass =
    item.status === 'Available'
      ? 'bg-[#e8f8f2] text-[#079669]'
      : item.status === 'Rejected'
      ? 'bg-[#fff0f1] text-[#dc3545]'
      : 'bg-[#fff6df] text-[#a36d00]';

  return (
    <article className="bg-white border border-[#dce7ee] rounded-[15px] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all">
      {/* Equipment Image Slot */}
      <div className="h-[160px] bg-[#eaf6fc] flex items-center justify-center relative overflow-hidden">
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
          <span className="text-[#087fc1] text-5xl font-light select-none">+</span>
        )}

        {item.estimated_value && (
          <div className="absolute bottom-2 right-2 bg-[#173b5d]/90 text-white font-mono text-[11px] font-bold px-2.5 py-0.5 rounded shadow-xs">
            Est. ₹{Number(item.estimated_value).toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* Equipment Body */}
      <div className="p-[22px] flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-[21px] font-bold text-[#173b5d] mb-3 leading-snug line-clamp-2">
            {item.name}
          </h3>

          <p className="text-[#6b8499] text-sm my-1.5">
            <strong className="text-[#173b5d]">Category: </strong>
            {item.category}
          </p>

          <p className="text-[#6b8499] text-sm my-1.5">
            <strong className="text-[#173b5d]">Condition: </strong>
            {item.condition}
          </p>

          <p className="text-[#6b8499] text-sm my-1.5">
            <strong className="text-[#173b5d]">Location: </strong>
            {item.location}
          </p>

          <p className="text-[#6b8499] text-sm my-1.5">
            <strong className="text-[#173b5d]">Sharing: </strong>
            {item.sharing_type}
          </p>

          <p className="text-[#6b8499] text-sm my-1.5">
            <strong className="text-[#173b5d]">Quantity: </strong>
            {item.quantity}
          </p>

          <span
            className={`inline-block mt-2.5 px-2.5 py-1 rounded-[20px] text-xs font-bold ${statusClass}`}
          >
            {item.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-[18px] pt-3 border-t border-[#dce7ee]/60">
          <button
            type="button"
            onClick={() => showDetails(item.id)}
            className="py-2 px-3 rounded-[7px] text-xs font-bold bg-[#e8f2f7] text-[#173b5d] hover:bg-[#d9e9f2] transition-colors"
          >
            View Details
          </button>

          {/* Request Button for NGO / Hospital */}
          {currentUser && !isDonor && !isMine && item.status === 'Available' && (
            <button
              type="button"
              onClick={() => openRequest(item.id)}
              className="py-2 px-3 rounded-[7px] text-xs font-bold bg-[#087fc1] text-white hover:bg-[#076fa9] transition-colors"
            >
              Request
            </button>
          )}

          {/* Add to Cart Option for NGO / Hospital */}
          {currentUser && !isDonor && item.status === 'Available' && (
            <button
              type="button"
              onClick={() => addToCart(item)}
              className={`py-2 px-3 rounded-[7px] text-xs font-bold transition-colors ${
                isInCart
                  ? 'bg-[#e8f8f2] text-[#079669] border border-[#079669]'
                  : 'bg-[#eef8fd] text-[#087fc1] border border-[#087fc1] hover:bg-[#d9effb]'
              }`}
            >
              {isInCart ? 'In Cart ✓' : '+ Add to Cart'}
            </button>
          )}

          {/* Always Available E-Receipt Button */}
          <button
            type="button"
            onClick={() => openReceiptForEquipment(item.id)}
            className="py-2 px-3 rounded-[7px] text-xs font-bold bg-[#e8f8f2] text-[#079669] hover:bg-[#d1f2e4] border border-[#a2dfc8] transition-colors flex items-center gap-1"
            title="Generate & View Certified E-Receipt Certificate for this item"
          >
            <span>🧾 E-Receipt</span>
          </button>

          {/* Tax E-Receipt for Donor Owner */}
          {isDonor && isMine && (
            <button
              type="button"
              onClick={() => generateTaxReceiptForDonorItem(item.id)}
              className="py-2 px-3 rounded-[7px] text-xs font-bold bg-[#079669] text-white hover:bg-[#067a55] transition-colors"
              title="Generate 501(c)(3) / 80G Tax Exemption Certificate"
            >
              80G Tax Cert
            </button>
          )}

          {/* Delete Button for Owner */}
          {isMine && (
            <button
              type="button"
              onClick={() => deleteEquipment(item.id)}
              className="py-2 px-3 rounded-[7px] text-xs font-bold bg-[#fff0f1] text-[#dc3545] hover:bg-[#ffe3e5] transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
