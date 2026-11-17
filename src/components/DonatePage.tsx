import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';
import { EquipmentCategory, EquipmentCondition, EquipmentSharingType } from '../types';

export const DonatePage: React.FC = () => {
  const { addEquipment, currentUser, showToast } = useMedBridge();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('Monitoring');
  const [condition, setCondition] = useState<EquipmentCondition>('Good');
  const [sharingType, setSharingType] = useState<EquipmentSharingType>('Donate');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(currentUser?.location || 'New Delhi Central Depot');
  const [estimatedValue, setEstimatedValue] = useState(48000);
  const [serialNumber, setSerialNumber] = useState(`SN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [description, setDescription] = useState('');
  const [generateReceipt, setGenerateReceipt] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !condition || !sharingType || !location || !description.trim()) {
      showToast('Please complete all required fields.');
      return;
    }

    await addEquipment(
      {
        name,
        category,
        condition,
        sharing_type: sharingType,
        quantity: Number(quantity),
        location,
        description: description.trim(),
        estimated_value: Number(estimatedValue),
        serial_number: serialNumber,
      },
      generateReceipt
    );

    // Reset fields
    setName('');
    setDescription('');
    setQuantity(1);
  };

  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%]">
      {/* Page Header */}
      <section className="mb-8">
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          SHARE EQUIPMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-2">
          List Medical Equipment
        </h1>
        <p className="text-[#6b8499] text-base">
          Add equipment that you want to donate, lend, or rent to support clinical healthcare facilities.
        </p>
      </section>

      {/* Form Card */}
      <div className="max-w-[900px] mx-auto bg-white border border-[#dce7ee] rounded-[18px] p-8 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Equipment Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ECG Machine, Patient Monitor, Wheelchair"
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              >
                <option value="Diagnostic">Diagnostic</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Mobility">Mobility</option>
                <option value="Surgical">Surgical</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Condition *
              </label>
              <select
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value as EquipmentCondition)}
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Sharing Type *
              </label>
              <select
                required
                value={sharingType}
                onChange={(e) => setSharingType(e.target.value as EquipmentSharingType)}
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              >
                <option value="Donate">Donate</option>
                <option value="Lend">Lend</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Estimated Fair Market Value (Indian Rupees ₹)
              </label>
              <input
                type="number"
                min={1}
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                placeholder="e.g. 50000"
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1] font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173b5d] mb-1.5">
                Device Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#173b5d] mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the medical equipment, operating conditions, accessories included..."
              className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
            />
          </div>

          {/* Automatic E-Receipt checkbox */}
          <div className="bg-[#f0fbf6] p-4 rounded-[12px] border border-[#a2dfc8]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={generateReceipt}
                onChange={(e) => setGenerateReceipt(e.target.checked)}
                className="mt-0.5 rounded text-[#079669] focus:ring-[#079669]"
              />
              <div>
                <span className="font-bold text-[#173b5d] block">
                  Generate Section 80G / 501(c)(3) Tax Exemption E-Receipt Immediately
                </span>
                <span className="text-xs text-[#6b8499] block mt-0.5">
                  Automatically generates an official cryptographically verified charitable gift-in-kind tax receipt upon submission.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#079669] hover:bg-[#067a55] text-white font-bold text-base rounded-[9px] transition-colors shadow-sm"
          >
            List Equipment & Issue Certificate
          </button>
        </form>
      </div>
    </main>
  );
};
