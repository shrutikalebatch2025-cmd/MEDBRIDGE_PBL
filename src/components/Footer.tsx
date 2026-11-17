import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const Footer: React.FC = () => {
  const { showPage, currentUser, switchRolePersona } = useMedBridge();

  return (
    <footer className="no-print mt-20 border-t border-[#dce7ee] bg-white py-12 text-[#6b8499] text-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="font-agbalumo text-[#087fc1] text-2xl">
              MedBridge
            </div>
            <p className="text-xs text-[#6b8499] leading-relaxed">
              Medical equipment sharing network designed to connect unused medical equipment with hospitals, clinics, and NGOs that need it.
            </p>
            <div className="text-[11px] text-[#079669] font-bold">
              ✓ Verified Requisitions & 501(c)(3) Tax Exemption
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#173b5d] uppercase tracking-wider text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => showPage('home')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPage('equipment')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  Find Equipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPage('cart')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  Requisition Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPage('receipts')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  E-Receipts Archive
                </button>
              </li>
              <li>
                <button
                  onClick={() => showPage('about')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  About MedBridge
                </button>
              </li>
            </ul>
          </div>

          {/* Role Switching */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#173b5d] uppercase tracking-wider text-[11px]">
              Profile Types
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => switchRolePersona('Donor')}
                  className="hover:text-[#079669] transition-colors"
                >
                  Switch to Donor Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchRolePersona('NGO / Hospital')}
                  className="hover:text-[#087fc1] transition-colors"
                >
                  Switch to NGO / Hospital Profile
                </button>
              </li>
              <li className="text-[11px] text-[#6b8499] pt-1">
                Active: <strong className="text-[#173b5d]">{currentUser?.role || 'Guest'}</strong>
              </li>
            </ul>
          </div>

          {/* Standards */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#173b5d] uppercase tracking-wider text-[11px]">
              Compliance & Safety
            </h4>
            <p className="text-xs text-[#6b8499] leading-relaxed">
              CDC Sterilization Standards · Section 80G Tax Exemption · Audited Custody Handoffs · Real-time QR Verification
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#dce7ee] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6b8499]">
          <div>
            © {new Date().getFullYear()} MedBridge Network. Connecting medical equipment with organizations that need it.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Audited Ledger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
