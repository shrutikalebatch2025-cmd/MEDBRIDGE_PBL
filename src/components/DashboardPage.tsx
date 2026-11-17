import React from 'react';
import { useMedBridge } from '../context/MedBridgeContext';
import { EquipmentCard } from './EquipmentCard';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    equipment,
    requests,
    activities,
    showPage,
    receipts,
  } = useMedBridge();

  if (!currentUser) return null;

  const initials = (name: string) => {
    return (
      name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0])
        .join('')
        .toUpperCase() || 'U'
    );
  };

  const myEquipment = equipment.filter(
    (e) =>
      e.owner_id === currentUser.id ||
      e.owner_name === currentUser.name ||
      e.owner_organization === currentUser.organization
  );

  const myRequests = requests.filter(
    (r) => r.userId === currentUser.id || r.email === currentUser.email
  );

  const approvedRequests = myRequests.filter((r) => r.status === 'Approved');

  const myDonations = myEquipment.filter((e) => e.sharing_type === 'Donate');

  const myActivities = activities.filter(
    (a) => a.userId === currentUser.id || a.email === currentUser.email
  );

  return (
    <main className="min-h-[calc(100vh-78px)] pb-16">
      {/* Profile Header */}
      <section className="pt-14 pb-8 px-[8%] flex items-center gap-6">
        <div className="w-[90px] h-[90px] rounded-full bg-[#087fc1] text-white flex items-center justify-center text-3xl font-extrabold shrink-0 shadow-sm">
          {initials(currentUser.name || currentUser.organization)}
        </div>

        <div>
          <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
            MY PROFILE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#173b5d] my-1">
            {currentUser.name}
          </h1>
          <p className="text-[#6b8499] text-sm sm:text-base font-semibold">
            {currentUser.role} · {currentUser.organization}
          </p>
        </div>
      </section>

      {/* Profile Card */}
      <section className="mx-[8%] mb-8 bg-white border border-[#dce7ee] rounded-[15px] p-6 grid grid-cols-2 lg:grid-cols-4 gap-5 shadow-2xs text-xs sm:text-sm">
        <div>
          <strong className="block text-[#173b5d] font-bold">Email</strong>
          <span className="block mt-1.5 text-[#6b8499]">{currentUser.email || 'Not provided'}</span>
        </div>

        <div>
          <strong className="block text-[#173b5d] font-bold">Phone</strong>
          <span className="block mt-1.5 text-[#6b8499]">{currentUser.phone || 'Not provided'}</span>
        </div>

        <div>
          <strong className="block text-[#173b5d] font-bold">Location</strong>
          <span className="block mt-1.5 text-[#6b8499]">{currentUser.location || 'Not provided'}</span>
        </div>

        <div>
          <strong className="block text-[#173b5d] font-bold">Organization</strong>
          <span className="block mt-1.5 text-[#6b8499]">{currentUser.organization || 'Not provided'}</span>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-2 px-[8%] grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl font-bold font-mono">
            {myEquipment.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5">My Equipment</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl font-bold font-mono">
            {myRequests.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5">My Requests</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl font-bold font-mono">
            {myDonations.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5">My Donations</p>
        </div>

        <div className="bg-white border border-[#dce7ee] rounded-[15px] p-6 shadow-2xs">
          <h2 className="text-[#087fc1] text-3xl font-bold font-mono">
            {approvedRequests.length}
          </h2>
          <p className="text-[#6b8499] text-sm mt-1.5">Approved Requests</p>
        </div>
      </section>

      {/* My Equipment Listings */}
      <section className="py-6 px-[8%]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
              MY LISTINGS
            </span>
            <h2 className="text-2xl sm:text-[30px] font-bold text-[#173b5d] mt-1">
              My Equipment
            </h2>
          </div>

          {currentUser.role === 'Donor' && (
            <button
              onClick={() => showPage('donate')}
              className="py-2 px-4 rounded-[9px] bg-[#079669] hover:bg-[#067a55] text-white font-bold text-xs sm:text-sm transition-colors"
            >
              + List New Equipment
            </button>
          )}
        </div>

        {myEquipment.length === 0 ? (
          <div className="bg-white border border-[#dce7ee] rounded-[15px] p-10 text-center max-w-lg mx-auto shadow-2xs">
            <h3 className="text-lg font-bold text-[#173b5d]">No equipment listed yet</h3>
            <p className="text-[#6b8499] text-sm mt-1">
              Your equipment listings will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEquipment.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Activity History */}
      <section className="py-8 px-[8%]">
        <div className="mb-6">
          <span className="text-[#087fc1] text-xs tracking-[1.5px] font-extrabold uppercase">
            HISTORY
          </span>
          <h2 className="text-2xl sm:text-[30px] font-bold text-[#173b5d] mt-1">
            My Activity
          </h2>
        </div>

        <div className="max-w-[1000px] space-y-3">
          {myActivities.length === 0 ? (
            <div className="bg-white border border-[#dce7ee] rounded-[12px] p-6 shadow-2xs">
              <strong className="block text-[#173b5d] font-bold mb-1">No activity yet</strong>
              <p className="text-[#6b8499] text-sm">
                Your donations, listings and requests will appear here.
              </p>
            </div>
          ) : (
            myActivities.slice(0, 20).map((act) => (
              <div
                key={act.id}
                className="bg-white border border-[#dce7ee] rounded-[12px] p-5 shadow-2xs space-y-1"
              >
                <strong className="block text-[#173b5d] font-bold text-sm">
                  {act.title}
                </strong>
                <p className="text-[#6b8499] text-sm">{act.details}</p>
                {act.extra && <p className="text-[#6b8499] text-xs">{act.extra}</p>}
                <small className="text-[#8ba0af] text-xs block font-mono">
                  {new Date(act.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};
