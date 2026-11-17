import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

export const RolePage: React.FC = () => {
  const { openAuth, quickDemoLogin } = useMedBridge();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f5fbff] to-[#e8f6fd] flex flex-col justify-center items-center py-10 px-5">
      <div className="font-agbalumo text-[#087fc1] text-4xl sm:text-5xl mb-2 tracking-tight">
        MedBridge
      </div>

      <p className="mt-2 mb-10 text-[#6b8499] text-base sm:text-lg text-center max-w-md">
        Tell us who you are so we can take you to the right place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
        {/* Donor Card */}
        <div
          onClick={() => openAuth('donor')}
          className="bg-white border border-[#dce7ee] rounded-[22px] p-8 sm:p-10 text-center shadow-[0_15px_35px_rgba(20,70,100,0.08)] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(20,70,100,0.13)] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-5xl text-[#079669] mb-4">♡</div>
            <h2 className="text-2xl font-bold text-[#173b5d] mb-3">I'm a Donor</h2>
            <p className="text-[#6b8499] text-sm sm:text-base leading-relaxed min-h-[60px]">
              I have medical equipment to give, lend, or rent at low cost.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="button"
              className="text-[#079669] font-bold text-base hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>Continue as Donor</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                quickDemoLogin('donor');
              }}
              className="text-xs text-[#079669] bg-[#e8f8f2] hover:bg-[#d1f2e4] px-3 py-1.5 rounded-lg font-semibold transition-colors block w-full"
            >
              Quick Test: Enter as Demo Donor
            </button>
          </div>
        </div>

        {/* NGO Card */}
        <div
          onClick={() => openAuth('ngo')}
          className="bg-white border border-[#dce7ee] rounded-[22px] p-8 sm:p-10 text-center shadow-[0_15px_35px_rgba(20,70,100,0.08)] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(20,70,100,0.13)] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-5xl text-[#087fc1] mb-4">⌂</div>
            <h2 className="text-2xl font-bold text-[#173b5d] mb-3">I'm an NGO / Hospital</h2>
            <p className="text-[#6b8499] text-sm sm:text-base leading-relaxed min-h-[60px]">
              I represent an organization that needs equipment for patients.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="button"
              className="text-[#087fc1] font-bold text-base hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>Continue as NGO / Hospital</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                quickDemoLogin('ngo');
              }}
              className="text-xs text-[#087fc1] bg-[#eef8fd] hover:bg-[#d9effb] px-3 py-1.5 rounded-lg font-semibold transition-colors block w-full"
            >
              Quick Test: Enter as Demo NGO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
