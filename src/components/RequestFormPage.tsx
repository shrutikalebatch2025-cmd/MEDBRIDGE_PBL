import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const RequestFormPage: React.FC = () => {
  const { selectedEquipment, showPage, submitRequest, showToast } = useMedBridge();

  const [duration, setDuration] = useState('1 Month');
  const [reason, setReason] = useState('');

  if (!selectedEquipment) {
    return (
      <main className="p-12 text-center">
        <button
          onClick={() => showPage('equipment')}
          className="text-[#087fc1] font-bold text-sm hover:underline"
        >
          ← Back to Equipment
        </button>
        <p className="text-[#6b8499] mt-4">Please select equipment first.</p>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !reason.trim()) {
      showToast('Please complete the request form.');
      return;
    }
    submitRequest(duration, reason.trim());
  };

  return (
    <main className="min-h-[calc(100vh-78px)] py-8 px-[8%]">
      <button
        onClick={() => showPage('equipment')}
        className="text-[#087fc1] font-bold text-sm mb-6 flex items-center gap-1 hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-[900px] mx-auto bg-white border border-[#dce7ee] rounded-[18px] p-8 sm:p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-[#173b5d] mb-6">Request Equipment</h1>

        {/* Selected Equipment Info Box */}
        <div className="bg-[#f8fbfd] border border-[#dce7ee] rounded-[15px] p-6 mb-6">
          <h3 className="text-xl font-bold text-[#173b5d] mb-2">
            {selectedEquipment.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-[#6b8499]">
            <p>
              <strong className="text-[#173b5d]">Category: </strong>
              {selectedEquipment.category}
            </p>
            <p>
              <strong className="text-[#173b5d]">Location: </strong>
              {selectedEquipment.location}
            </p>
            <p>
              <strong className="text-[#173b5d]">Sharing Type: </strong>
              {selectedEquipment.sharing_type}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-[#173b5d] mb-1.5">
              Request Duration *
            </label>
            <select
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
            >
              <option value="Permanent">Permanent</option>
              <option value="1 Week">1 Week</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#173b5d] mb-1.5">
              Reason for Request *
            </label>
            <textarea
              required
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the equipment is required for patients or clinic operations..."
              className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-base rounded-[9px] transition-colors shadow-sm"
          >
            Submit Request
          </button>
        </form>
      </div>
    </main>
  );
};
