import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';
import { SUPABASE_URL } from '../supabase';

export const DatabaseViewerPage: React.FC = () => {
  const {
    equipment,
    requests,
    receipts,
    activities,
    currentUser,
  } = useMedBridge();

  const [activeTable, setActiveTable] = useState<
    'equipment' | 'profiles' | 'requests' | 'receipts' | 'activities'
  >('equipment');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const projectId = 'udmhtfsrszntxnfrgowl';
  const supabaseConsoleUrl = `https://supabase.com/dashboard/project/${projectId}/editor`;
  const supabaseAuthUrl = `https://supabase.com/dashboard/project/${projectId}/auth/users`;

  // Profiles dataset (current session + sample donors/NGOs)
  const profilesData = [
    ...(currentUser ? [currentUser] : []),
    {
      id: 'donor-demo-1',
      name: 'Dr. Marcus Vance, MD',
      email: 'marcus.vance@apexhealth.org',
      phone: '9876543210',
      organization: 'Apex Biomedical Relief Alliance',
      organizationType: 'Healthcare Foundation',
      role: 'Donor',
      location: 'Metropolitan Medical District',
    },
    {
      id: 'ngo-demo-1',
      name: 'Sarah Chen, RN',
      email: 'schen@hopehorizonhealth.org',
      phone: '9876543211',
      organization: 'Hope Horizon Rural Health Foundation',
      organizationType: 'NGO',
      role: 'NGO / Hospital',
      location: 'District Ward 7 Clinic',
    },
  ].filter((v, i, a) => a.findIndex((t) => t.id === v.id || t.email === v.email) === i);

  // Get current active data
  const getCurrentData = () => {
    switch (activeTable) {
      case 'equipment':
        return equipment;
      case 'profiles':
        return profilesData;
      case 'requests':
        return requests;
      case 'receipts':
        return receipts;
      case 'activities':
        return activities;
      default:
        return [];
    }
  };

  const rawData = getCurrentData();

  // Filter rows
  const filteredData = rawData.filter((row: any) => {
    if (!searchTerm.trim()) return true;
    const str = JSON.stringify(row).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(rawData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medbridge_${activeTable}_table.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-[calc(100vh-78px)] py-12 px-[8%] space-y-8">
      {/* Header */}
      <section>
        <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
          DATABASE & SYSTEM LEDGER
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-2">
          Where to See Your Database
        </h1>
        <p className="text-[#6b8499] text-base max-w-3xl leading-relaxed">
          MedBridge stores your data both in your configured <strong>Supabase Cloud Database</strong> and within this live interactive in-app ledger. Here is how to view your data in both places.
        </p>
      </section>

      {/* Guide Card: How to see in Supabase */}
      <section className="bg-white border-2 border-[#087fc1]/30 rounded-[20px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dce7ee]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087fc1] text-white flex items-center justify-center text-xl font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#173b5d]">
                Option 1: In Your Official Supabase Cloud Console
              </h2>
              <span className="text-xs text-[#6b8499] font-mono">
                Project URL: {SUPABASE_URL}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={supabaseConsoleUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-[8px] bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>Open Supabase Table Editor</span>
              <span>↗</span>
            </a>

            <a
              href={supabaseAuthUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-4 rounded-[8px] bg-[#e8f2f7] hover:bg-[#d9e9f2] text-[#173b5d] font-bold text-xs transition-colors inline-flex items-center gap-1.5"
            >
              <span>View Auth Users</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="bg-[#f8fbfd] p-4 rounded-[12px] border border-[#dce7ee] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#087fc1] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-[#173b5d] text-sm">Table Editor</h3>
            <p className="text-[#6b8499] leading-relaxed">
              In your Supabase dashboard, click <strong>Table Editor</strong> on the left navigation bar to see tables:
            </p>
            <ul className="list-disc list-inside text-[#173b5d] font-mono space-y-0.5">
              <li>equipment</li>
              <li>profiles</li>
              <li>requests</li>
            </ul>
          </div>

          <div className="bg-[#f8fbfd] p-4 rounded-[12px] border border-[#dce7ee] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#087fc1] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-[#173b5d] text-sm">Authentication / Users</h3>
            <p className="text-[#6b8499] leading-relaxed">
              Go to <strong>Authentication → Users</strong> in Supabase to see all registered Donor and NGO / Hospital logins, emails, and last sign-in timestamps.
            </p>
          </div>

          <div className="bg-[#f8fbfd] p-4 rounded-[12px] border border-[#dce7ee] space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#087fc1] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-bold text-[#173b5d] text-sm">SQL Editor Query</h3>
            <p className="text-[#6b8499] leading-relaxed">
              Open the <strong>SQL Editor</strong> tab and run queries like:
            </p>
            <code className="block bg-[#173b5d] text-white p-2 rounded text-[11px] font-mono">
              SELECT * FROM equipment;
            </code>
          </div>
        </div>
      </section>

      {/* Guide Card: In-App Database Browser */}
      <section className="bg-white border border-[#dce7ee] rounded-[20px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dce7ee]">
          <div>
            <h2 className="text-xl font-bold text-[#173b5d]">
              Option 2: Live In-App Database Inspector
            </h2>
            <p className="text-xs text-[#6b8499] mt-0.5">
              Inspect your live local and synchronized database records directly below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#f8fbfd] border border-[#dce7ee] p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#173b5d] text-white'
                    : 'text-[#6b8499] hover:text-[#173b5d]'
                }`}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${
                  viewMode === 'json'
                    ? 'bg-[#173b5d] text-white'
                    : 'text-[#6b8499] hover:text-[#173b5d]'
                }`}
              >
                Raw JSON
              </button>
            </div>

            <button
              onClick={handleExportJSON}
              className="py-1.5 px-3 rounded-lg bg-[#e8f2f7] hover:bg-[#d9e9f2] text-[#173b5d] text-xs font-bold transition-colors"
            >
              📥 Export JSON
            </button>
          </div>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTable('equipment')}
            className={`px-3.5 py-2 rounded-[9px] font-bold whitespace-nowrap transition-all ${
              activeTable === 'equipment'
                ? 'bg-[#087fc1] text-white shadow-2xs'
                : 'bg-[#f8fbfd] text-[#6b8499] hover:text-[#173b5d] border border-[#dce7ee]'
            }`}
          >
            📦 equipment ({equipment.length} rows)
          </button>

          <button
            onClick={() => setActiveTable('profiles')}
            className={`px-3.5 py-2 rounded-[9px] font-bold whitespace-nowrap transition-all ${
              activeTable === 'profiles'
                ? 'bg-[#087fc1] text-white shadow-2xs'
                : 'bg-[#f8fbfd] text-[#6b8499] hover:text-[#173b5d] border border-[#dce7ee]'
            }`}
          >
            👥 profiles / users ({profilesData.length} rows)
          </button>

          <button
            onClick={() => setActiveTable('requests')}
            className={`px-3.5 py-2 rounded-[9px] font-bold whitespace-nowrap transition-all ${
              activeTable === 'requests'
                ? 'bg-[#087fc1] text-white shadow-2xs'
                : 'bg-[#f8fbfd] text-[#6b8499] hover:text-[#173b5d] border border-[#dce7ee]'
            }`}
          >
            📋 requests ({requests.length} rows)
          </button>

          <button
            onClick={() => setActiveTable('receipts')}
            className={`px-3.5 py-2 rounded-[9px] font-bold whitespace-nowrap transition-all ${
              activeTable === 'receipts'
                ? 'bg-[#087fc1] text-white shadow-2xs'
                : 'bg-[#f8fbfd] text-[#6b8499] hover:text-[#173b5d] border border-[#dce7ee]'
            }`}
          >
            🧾 e_receipts ({receipts.length} rows)
          </button>

          <button
            onClick={() => setActiveTable('activities')}
            className={`px-3.5 py-2 rounded-[9px] font-bold whitespace-nowrap transition-all ${
              activeTable === 'activities'
                ? 'bg-[#087fc1] text-white shadow-2xs'
                : 'bg-[#f8fbfd] text-[#6b8499] hover:text-[#173b5d] border border-[#dce7ee]'
            }`}
          >
            🕒 activities ({activities.length} rows)
          </button>
        </div>

        {/* Filter Input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter rows in ${activeTable} table...`}
            className="w-full max-w-md border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-2.5 text-xs text-[#173b5d] outline-none focus:border-[#087fc1]"
          />
          <span className="text-xs text-[#6b8499]">
            Showing {filteredData.length} of {rawData.length} rows
          </span>
        </div>

        {/* Content View: Table vs JSON */}
        {viewMode === 'json' ? (
          <div className="bg-[#173b5d] text-[#eef8fd] p-4 rounded-[12px] font-mono text-xs max-h-[500px] overflow-auto">
            <pre>{JSON.stringify(filteredData, null, 2)}</pre>
          </div>
        ) : (
          <div className="border border-[#dce7ee] rounded-[14px] overflow-x-auto max-h-[500px]">
            {filteredData.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6b8499]">
                No matching rows found in `{activeTable}` table.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f8fbfd] text-[#173b5d] font-bold sticky top-0 border-b border-[#dce7ee]">
                  <tr>
                    {Object.keys(filteredData[0] || {}).map((col) => (
                      <th key={col} className="py-2.5 px-3 font-mono border-r border-[#dce7ee]/60 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce7ee] font-mono">
                  {filteredData.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-[#f8fbfd]">
                      {Object.keys(filteredData[0] || {}).map((col) => {
                        const val = row[col];
                        const displayVal =
                          typeof val === 'object'
                            ? JSON.stringify(val)
                            : String(val ?? '');

                        return (
                          <td
                            key={col}
                            className="py-2.5 px-3 border-r border-[#dce7ee]/60 max-w-[240px] truncate text-[#173b5d]"
                            title={displayVal}
                          >
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </main>
  );
};
