import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%]">
      {/* Page Header */}
      <section className="mb-10">
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          ABOUT MEDBRIDGE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#173b5d] my-3">
          Connecting Equipment With Need
        </h1>
        <p className="text-[#6b8499] text-base sm:text-lg max-w-3xl leading-relaxed">
          MedBridge is a medical equipment sharing network designed to connect unused medical equipment with organizations that need it.
        </p>
      </section>

      {/* About Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-8 shadow-2xs">
          <h2 className="text-2xl font-bold text-[#173b5d] mb-4">The Problem</h2>
          <p className="text-[#6b8499] leading-relaxed text-sm sm:text-base">
            Medical equipment can remain unused in hospitals and organizations while other healthcare facilities struggle to access essential resources.
          </p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-8 shadow-2xs">
          <h2 className="text-2xl font-bold text-[#173b5d] mb-4">Our Solution</h2>
          <p className="text-[#6b8499] leading-relaxed text-sm sm:text-base">
            MedBridge provides a centralized platform for listing, discovering, requesting and tracking medical equipment.
          </p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-8 shadow-2xs">
          <h2 className="text-2xl font-bold text-[#173b5d] mb-4">Our Goal</h2>
          <p className="text-[#6b8499] leading-relaxed text-sm sm:text-base">
            Increase equipment utilization, reduce unnecessary wastage and support healthcare organizations with limited resources.
          </p>
        </div>
      </section>

      {/* Compliance & Standards Callout */}
      <section className="mt-12 p-8 bg-[#f0f9fe] border border-[#dce7ee] rounded-[18px] max-w-6xl">
        <h3 className="text-xl font-bold text-[#173b5d] mb-2">
          Verifiable Requisitions & Tax Exemption
        </h3>
        <p className="text-[#6b8499] text-sm leading-relaxed max-w-4xl">
          Every equipment allocation through MedBridge issues an audited cryptographic e-receipt. Healthcare providers and NGOs receive signed custody handoffs, while donors receive Section 80G and IRS 501(c)(3) verified charitable in-kind contribution documentation.
        </p>
      </section>
    </main>
  );
};
