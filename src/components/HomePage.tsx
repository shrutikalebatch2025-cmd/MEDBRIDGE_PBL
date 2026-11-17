import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';
import { EquipmentCard } from './EquipmentCard';

export const HomePage: React.FC = () => {
  const { equipment, requests, showPage } = useMedBridge();

  const availableEquipment = equipment.filter((e) => e.status === 'Available');
  const approvedRequests = requests.filter((r) => r.status === 'Approved');

  // Organizations connected metric (unique owners + requesters)
  const orgCount = new Set([
    ...equipment.map((e) => e.owner_organization || e.owner_name),
    ...requests.map((r) => r.organization),
  ]).size;

  const recentEquipment = equipment.slice(0, 6);

  return (
    <main className="min-h-[calc(100vh-78px)] pb-16">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-[8%] bg-gradient-to-br from-[#f0f9fe] to-white border-b border-[#dce7ee]">
        <div className="max-w-[850px]">
          <span className="text-[#087fc1] text-xs sm:text-[13px] tracking-[1.5px] font-extrabold uppercase">
            MEDICAL EQUIPMENT SHARING NETWORK
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-[#173b5d] leading-[1.08] my-6">
            Connecting medical equipment with organizations that need it.
          </h1>

          <p className="text-[#6b8499] text-base sm:text-[19px] leading-[1.7] max-w-[760px]">
            MedBridge helps hospitals, clinics, NGOs and donors discover, share, borrow and reuse medical equipment.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => showPage('equipment')}
              className="py-3.5 px-6 rounded-[9px] bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-base transition-colors shadow-sm"
            >
              Find Equipment
            </button>

            <button
              onClick={() => showPage('donate')}
              className="py-3.5 px-6 rounded-[9px] bg-[#e7eef4] hover:bg-[#d6e2ec] text-[#173b5d] font-bold text-base transition-colors"
            >
              List Equipment
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-9 px-[8%] grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl sm:text-[32px] font-bold font-mono">
            {availableEquipment.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5 font-medium">Available Equipment</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl sm:text-[32px] font-bold font-mono">
            {orgCount > 0 ? orgCount : 6}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5 font-medium">Organizations Connected</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl sm:text-[32px] font-bold font-mono">
            {approvedRequests.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5 font-medium">Equipment Shared</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl sm:text-[32px] font-bold font-mono">
            {requests.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5 font-medium">Requests</p>
        </div>
      </section>

      {/* Recently Added Equipment */}
      <section className="py-12 px-[8%]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
              RECENTLY ADDED
            </span>
            <h2 className="text-2xl sm:text-[30px] font-bold text-[#173b5d] mt-1">
              Recently Added Equipment
            </h2>
          </div>

          <button
            onClick={() => showPage('equipment')}
            className="py-2.5 px-5 rounded-[9px] bg-[#e7eef4] hover:bg-[#d6e2ec] text-[#173b5d] font-bold text-sm transition-colors"
          >
            View All
          </button>
        </div>

        {recentEquipment.length === 0 ? (
          <div className="bg-white border border-[#dce7ee] rounded-[15px] p-8 text-center max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-[#173b5d]">No equipment listed yet.</h3>
            <p className="text-[#6b8499] text-sm mt-1">
              Donors can add equipment from the List Equipment section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEquipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
