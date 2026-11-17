import React, { useState, useMemo } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentCategory, EquipmentCondition, EquipmentSharingType } from '../types';

export const EquipmentPage: React.FC = () => {
  const { equipment } = useMedBridge();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [sharingType, setSharingType] = useState<string>('');

  const filtered = useMemo(() => {
    return equipment.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.name + ' ' + item.category + ' ' + item.location + ' ' + item.description)
          .toLowerCase()
          .includes(q);

      const matchesCat = !category || item.category === category;
      const matchesCond = !condition || item.condition === condition;
      const matchesType = !sharingType || item.sharing_type === sharingType;

      return matchesSearch && matchesCat && matchesCond && matchesType;
    });
  }, [equipment, search, category, condition, sharingType]);

  return (
    <main className="min-h-[calc(100vh-78px)] pb-16">
      {/* Header */}
      <section className="pt-16 pb-8 px-[8%]">
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          MEDICAL EQUIPMENT
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#173b5d] my-3">
          Find Equipment
        </h1>
        <p className="text-[#6b8499] text-base sm:text-lg">
          Search available equipment listed by donors and organizations.
        </p>
      </section>

      {/* Filter Box */}
      <section className="mx-[8%] mb-6 p-5 bg-white border border-[#dce7ee] rounded-[15px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-2xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search equipment..."
          className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-sm text-[#173b5d] outline-none focus:border-[#087fc1]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-sm text-[#173b5d] outline-none focus:border-[#087fc1]"
        >
          <option value="">All Categories</option>
          <option value="Diagnostic">Diagnostic</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Mobility">Mobility</option>
          <option value="Surgical">Surgical</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-sm text-[#173b5d] outline-none focus:border-[#087fc1]"
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Good">Good</option>
          <option value="Used">Used</option>
          <option value="Needs Repair">Needs Repair</option>
        </select>

        <select
          value={sharingType}
          onChange={(e) => setSharingType(e.target.value)}
          className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-sm text-[#173b5d] outline-none focus:border-[#087fc1]"
        >
          <option value="">All Sharing Types</option>
          <option value="Donate">Donate</option>
          <option value="Lend">Lend</option>
          <option value="Rent">Rent</option>
        </select>
      </section>

      {/* Result Count */}
      <p className="mx-[8%] mb-5 text-[#6b8499] text-sm">
        {filtered.length} equipment item{filtered.length === 1 ? '' : 's'} found
      </p>

      {/* Equipment Grid */}
      <section className="px-[8%]">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#dce7ee] rounded-[15px] p-10 text-center max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#173b5d]">No equipment found.</h3>
            <p className="text-[#6b8499] text-sm mt-1">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
