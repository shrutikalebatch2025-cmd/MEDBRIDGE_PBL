/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MedBridgeProvider, useMedBridge } from './context/MedBridgeContext';
import { RolePage } from './components/RolePage';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { EquipmentPage } from './components/EquipmentPage';
import { EquipmentDetailsPage } from './components/EquipmentDetailsPage';
import { CartPage } from './components/CartPage';
import { RequestsPage } from './components/RequestsPage';
import { RequestFormPage } from './components/RequestFormPage';
import { DonatePage } from './components/DonatePage';
import { ReceiptsPage } from './components/ReceiptsPage';
import { DashboardPage } from './components/DashboardPage';
import { AboutPage } from './components/AboutPage';
import { DatabaseViewerPage } from './components/DatabaseViewerPage';
import { EReceiptModal } from './components/EReceiptModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    currentUser,
    currentPage,
    selectedRoleForAuth,
    activeReceiptModal,
    setActiveReceiptModal,
    toastMessage,
  } = useMedBridge();

  // If not logged in, show role selection or auth flow
  if (!currentUser) {
    if (selectedRoleForAuth) {
      return (
        <>
          <AuthPage role={selectedRoleForAuth} />
          <Toast message={toastMessage} />
        </>
      );
    }
    return (
      <>
        <RolePage />
        <Toast message={toastMessage} />
      </>
    );
  }

  // When logged in, render the main MedBridge application
  return (
    <div className="min-h-screen flex flex-col bg-[#f5faff] text-[#173b5d] font-sans selection:bg-[#087fc1] selection:text-white">
      {/* Main Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <div className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'equipment' && <EquipmentPage />}
        {currentPage === 'details' && <EquipmentDetailsPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'requests' && <RequestsPage />}
        {currentPage === 'request' && <RequestFormPage />}
        {currentPage === 'donate' && <DonatePage />}
        {currentPage === 'receipts' && <ReceiptsPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'database' && <DatabaseViewerPage />}
      </div>

      {/* Footer */}
      <Footer />

      {/* Verifiable E-Receipt Modal */}
      {activeReceiptModal && (
        <EReceiptModal
          receipt={activeReceiptModal}
          onClose={() => setActiveReceiptModal(null)}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default function App() {
  return (
    <MedBridgeProvider>
      <AppContent />
    </MedBridgeProvider>
  );
}
