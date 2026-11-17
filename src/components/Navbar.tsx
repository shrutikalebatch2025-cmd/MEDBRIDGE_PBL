import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    showPage,
    logout,
    cart,
    receipts,
    switchRolePersona,
  } = useMedBridge();

  const isDonor = currentUser?.role === 'Donor';

  return (
    <header className="no-print h-[78px] bg-white border-b border-[#dce7ee] flex items-center justify-between px-6 sm:px-12 sticky top-0 z-30 shadow-2xs">
      {/* Brand Wordmark */}
      <div
        onClick={() => showPage('home')}
        className="font-agbalumo text-[#087fc1] text-3xl cursor-pointer select-none"
      >
        MedBridge
      </div>

      {/* Navigation Buttons */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#173b5d]">
        <button
          onClick={() => showPage('home')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'home' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          Home
        </button>

        <button
          onClick={() => showPage('equipment')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'equipment' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          Equipment
        </button>

        {/* Cart Option Button */}
        <button
          onClick={() => showPage('cart')}
          className={`hover:text-[#087fc1] transition-colors py-1 flex items-center gap-1.5 ${
            currentPage === 'cart' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="bg-[#087fc1] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {cart.length}
            </span>
          )}
        </button>

        <button
          onClick={() => showPage('requests')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'requests' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          Requests
        </button>

        <button
          onClick={() => showPage('donate')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'donate' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          Donate
        </button>

        {/* E-Receipts Option Button */}
        <button
          onClick={() => showPage('receipts')}
          className={`hover:text-[#087fc1] transition-colors py-1 flex items-center gap-1.5 ${
            currentPage === 'receipts' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          <span>E-Receipts</span>
          {receipts.length > 0 && (
            <span className="bg-[#079669] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {receipts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => showPage('dashboard')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'dashboard' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          Dashboard
        </button>

        {/* Database View Option */}
        <button
          onClick={() => showPage('database')}
          className={`hover:text-[#087fc1] transition-colors py-1 flex items-center gap-1 ${
            currentPage === 'database' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          <span>Database</span>
          <span className="text-[10px] bg-[#e8f2f7] text-[#087fc1] px-1 py-0.2 rounded font-mono font-bold">
            Live
          </span>
        </button>

        <button
          onClick={() => showPage('about')}
          className={`hover:text-[#087fc1] transition-colors py-1 ${
            currentPage === 'about' ? 'text-[#087fc1] border-b-2 border-[#087fc1]' : ''
          }`}
        >
          About
        </button>
      </nav>

      {/* Right User Persona / Logout */}
      <div className="flex items-center gap-3">
        {/* Quick Role Toggle Chip */}
        {currentUser && (
          <div className="hidden sm:flex items-center bg-[#f0f9fe] border border-[#dce7ee] rounded-full px-3 py-1 text-xs">
            <span className="text-[#6b8499] mr-1.5">Active Role:</span>
            <button
              onClick={() => switchRolePersona(isDonor ? 'NGO / Hospital' : 'Donor')}
              className={`font-bold hover:underline flex items-center gap-1 ${
                isDonor ? 'text-[#079669]' : 'text-[#087fc1]'
              }`}
              title="Click to quickly toggle role"
            >
              <span>{currentUser.role}</span>
              <span className="text-[10px] text-[#6b8499] bg-white px-1.5 py-0.5 rounded-full border border-[#dce7ee]">
                Switch
              </span>
            </button>
          </div>
        )}

        <button
          onClick={logout}
          className="text-[#dc3545] font-bold text-sm hover:underline py-1 px-2"
        >
          Log Out
        </button>
      </div>

      {/* Mobile nav bar row below for small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#dce7ee] py-2 px-3 flex justify-around text-xs font-bold text-[#173b5d] z-30">
        <button
          onClick={() => showPage('home')}
          className={currentPage === 'home' ? 'text-[#087fc1]' : ''}
        >
          Home
        </button>
        <button
          onClick={() => showPage('equipment')}
          className={currentPage === 'equipment' ? 'text-[#087fc1]' : ''}
        >
          Equipment
        </button>
        <button
          onClick={() => showPage('cart')}
          className={`relative ${currentPage === 'cart' ? 'text-[#087fc1]' : ''}`}
        >
          Cart
          {cart.length > 0 && (
            <span className="ml-1 bg-[#087fc1] text-white text-[10px] px-1 py-0.2 rounded-full">
              {cart.length}
            </span>
          )}
        </button>
        <button
          onClick={() => showPage('receipts')}
          className={`relative ${currentPage === 'receipts' ? 'text-[#087fc1]' : ''}`}
        >
          Receipts
          {receipts.length > 0 && (
            <span className="ml-1 bg-[#079669] text-white text-[10px] px-1 py-0.2 rounded-full">
              {receipts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => showPage('donate')}
          className={currentPage === 'donate' ? 'text-[#087fc1]' : ''}
        >
          Donate
        </button>
        <button
          onClick={() => showPage('dashboard')}
          className={currentPage === 'dashboard' ? 'text-[#087fc1]' : ''}
        >
          Profile
        </button>
        <button
          onClick={() => showPage('database')}
          className={currentPage === 'database' ? 'text-[#087fc1]' : ''}
        >
          DB
        </button>
      </div>
    </header>
  );
};
