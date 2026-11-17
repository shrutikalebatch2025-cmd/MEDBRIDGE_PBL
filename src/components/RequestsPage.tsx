import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const RequestsPage: React.FC = () => {
  const { requests, currentUser, receipts, setActiveReceiptModal, openReceiptForEquipment } = useMedBridge();

  const myRequests = currentUser
    ? requests.filter(
        (r) => r.userId === currentUser.id || r.email === currentUser.email
      )
    : [];

  const handleInspectReceipt = (equipmentId: string, receiptId?: string) => {
    if (receiptId) {
      const match = receipts.find((r) => r.receiptNumber === receiptId);
      if (match) {
        setActiveReceiptModal(match);
        return;
      }
    }
    // Fallback: automatically find or generate the verified receipt for this equipment!
    openReceiptForEquipment(equipmentId);
  };

  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%]">
      {/* Header */}
      <section className="mb-8">
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          REQUEST MANAGEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-2">
          My Requests
        </h1>
        <p className="text-[#6b8499] text-base">
          Track equipment requests, allocation approvals, and handoff consignment receipts.
        </p>
      </section>

      {/* Requests List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {myRequests.length === 0 ? (
          <div className="bg-white border border-[#dce7ee] rounded-[15px] p-10 text-center shadow-2xs">
            <h3 className="text-lg font-bold text-[#173b5d]">No requests yet</h3>
            <p className="text-[#6b8499] text-sm mt-1">
              Equipment requests that you submit or check out through your cart will appear here.
            </p>
          </div>
        ) : (
          myRequests.map((request) => {
            const statusClass =
              request.status === 'Approved'
                ? 'bg-[#e8f8f2] text-[#079669]'
                : request.status === 'Rejected'
                ? 'bg-[#fff0f1] text-[#dc3545]'
                : 'bg-[#fff6df] text-[#a36d00]';

            return (
              <div
                key={request.id}
                className="bg-white border border-[#dce7ee] rounded-[14px] p-6 shadow-2xs space-y-2 hover:border-[#087fc1]/50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[#173b5d]">
                    {request.equipmentName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-[20px] text-xs font-bold ${statusClass}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6b8499] pt-1">
                  <p>
                    <strong className="text-[#173b5d]">Provider: </strong>
                    {request.owner}
                  </p>
                  <p>
                    <strong className="text-[#173b5d]">Duration: </strong>
                    {request.duration}
                  </p>
                  <p>
                    <strong className="text-[#173b5d]">Date: </strong>
                    {new Date(request.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p>
                    <strong className="text-[#173b5d]">Requester: </strong>
                    {request.requester} ({request.organization})
                  </p>
                </div>

                <p className="text-xs text-[#6b8499] pt-1 leading-relaxed bg-[#f8fbfd] p-3 rounded-lg border border-[#dce7ee]">
                  <strong className="text-[#173b5d]">Reason: </strong>
                  {request.reason}
                </p>

                {/* E-Receipt Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleInspectReceipt(request.equipmentId, request.receiptId)}
                    className="text-xs font-bold text-[#079669] hover:bg-[#d1f2e4] flex items-center gap-1.5 bg-[#e8f8f2] px-3.5 py-1.5 rounded-lg border border-[#a2dfc8] transition-colors"
                  >
                    <span>🧾 View Official E-Receipt {request.receiptId ? `(${request.receiptId})` : ''}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};
