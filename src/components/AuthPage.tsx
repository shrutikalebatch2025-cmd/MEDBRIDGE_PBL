import React, { useState } from 'react';
import { useMedBridge } from '../context/MedBridgeContext';

interface AuthPageProps {
  role: 'donor' | 'ngo';
}

export const AuthPage: React.FC<AuthPageProps> = ({ role }) => {
  const { backToRoles, authMode, setAuthMode, login, signup, showToast, quickDemoLogin } = useMedBridge();

  // Login form state
  const [loginEmail, setLoginEmail] = useState(
    role === 'donor' ? 'marcus.vance@apexhealth.org' : 'schen@hopehorizonhealth.org'
  );
  const [loginPassword, setLoginPassword] = useState('password123');

  // Donor Signup state
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorLocation, setDonorLocation] = useState('');
  const [donorPassword, setDonorPassword] = useState('');
  const [donorConfirmPassword, setDonorConfirmPassword] = useState('');

  // NGO Signup state
  const [ngoOrganization, setNgoOrganization] = useState('');
  const [ngoContact, setNgoContact] = useState('');
  const [ngoEmail, setNgoEmail] = useState('');
  const [ngoPhone, setNgoPhone] = useState('');
  const [ngoType, setNgoType] = useState('NGO');
  const [ngoLocation, setNgoLocation] = useState('');
  const [ngoPassword, setNgoPassword] = useState('');
  const [ngoConfirmPassword, setNgoConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const isDonor = role === 'donor';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter email and password.');
      return;
    }
    setLoading(true);
    await login(role, loginEmail.trim().toLowerCase(), loginPassword);
    setLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDonor) {
      if (!donorName || !donorEmail || !donorPhone || !donorLocation || !donorPassword || !donorConfirmPassword) {
        showToast('Please fill all required fields.');
        return;
      }
      if (donorPassword.length < 6) {
        showToast('Password must contain at least 6 characters.');
        return;
      }
      if (donorPassword !== donorConfirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      setLoading(true);
      await signup('donor', {
        name: donorName.trim(),
        email: donorEmail.trim().toLowerCase(),
        phone: donorPhone.trim(),
        location: donorLocation.trim(),
        password: donorPassword,
        organization: donorName.trim(),
      });
      setLoading(false);
    } else {
      if (!ngoOrganization || !ngoContact || !ngoEmail || !ngoPhone || !ngoLocation || !ngoPassword || !ngoConfirmPassword) {
        showToast('Please fill all required fields.');
        return;
      }
      if (ngoPassword.length < 6) {
        showToast('Password must contain at least 6 characters.');
        return;
      }
      if (ngoPassword !== ngoConfirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      setLoading(true);
      await signup('ngo', {
        name: ngoContact.trim(),
        organization: ngoOrganization.trim(),
        email: ngoEmail.trim().toLowerCase(),
        phone: ngoPhone.trim(),
        location: ngoLocation.trim(),
        organizationType: ngoType,
        password: ngoPassword,
      });
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[45%_55%] bg-[#f5faff]">
      {/* Left Column */}
      <div
        className={`p-10 sm:p-16 lg:p-20 flex flex-col justify-center ${
          isDonor ? 'bg-[#effbf7]' : 'bg-[#eef8fd]'
        }`}
      >
        <div className="font-agbalumo text-[#087fc1] text-4xl mb-4">MedBridge</div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173b5d] leading-[1.12] my-6 max-w-xl">
          {isDonor
            ? 'Thank you for giving equipment a second life.'
            : 'Find the equipment your patients need.'}
        </h1>

        <p className="text-[#6b8499] text-base sm:text-lg leading-relaxed max-w-lg">
          {isDonor
            ? 'List medical equipment in minutes and help organizations that need healthcare resources.'
            : 'Browse equipment from donors and organizations and request resources for your patients.'}
        </p>

        <div className="mt-8 pt-6 border-t border-[#dce7ee]/60">
          <button
            onClick={() => quickDemoLogin(role)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-2xs ${
              isDonor
                ? 'bg-[#079669] text-white hover:bg-[#067a55]'
                : 'bg-[#087fc1] text-white hover:bg-[#076fa9]'
            }`}
          >
            Instant Demo Bypass → Enter as {isDonor ? 'Verified Donor' : 'Registered NGO'}
          </button>
        </div>
      </div>

      {/* Right Column: Auth Box */}
      <div className="flex justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-[500px] bg-white p-8 sm:p-10 rounded-[22px] shadow-[0_20px_50px_rgba(30,70,100,0.1)] border border-[#dce7ee]">
          
          <button
            type="button"
            onClick={backToRoles}
            className="text-[#087fc1] font-bold text-sm mb-6 flex items-center gap-1 hover:underline"
          >
            ← Back to role selection
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#173b5d]">
            {isDonor ? 'Donor Access' : 'NGO / Hospital Access'}
          </h2>

          <p className="text-[#6b8499] text-sm mt-1 mb-6">
            {isDonor ? 'Sign in or create a donor account' : 'Sign in or register your organization'}
          </p>

          {/* Auth Tabs */}
          <div className="flex border-b border-[#dce7ee] mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                authMode === 'login'
                  ? 'text-[#087fc1] border-[#087fc1]'
                  : 'text-[#6b8499] border-transparent hover:text-[#173b5d]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${
                authMode === 'signup'
                  ? 'text-[#087fc1] border-[#087fc1]'
                  : 'text-[#6b8499] border-transparent hover:text-[#173b5d]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#173b5d] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#173b5d] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-5 text-white font-bold text-sm sm:text-base rounded-[9px] transition-all shadow-sm ${
                  isDonor
                    ? 'bg-[#079669] hover:bg-[#067a55]'
                    : 'bg-[#087fc1] hover:bg-[#076fa9]'
                }`}
              >
                {loading ? 'Logging in...' : isDonor ? 'Log In as Donor' : 'Log In as NGO / Hospital'}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs sm:text-sm max-h-[60vh] overflow-y-auto pr-1">
              {isDonor ? (
                <>
                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={donorLocation}
                      onChange={(e) => setDonorLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={donorPassword}
                      onChange={(e) => setDonorPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={donorConfirmPassword}
                      onChange={(e) => setDonorConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-5 bg-[#079669] hover:bg-[#067a55] text-white font-bold text-sm sm:text-base rounded-[9px] transition-all shadow-sm mt-3"
                  >
                    {loading ? 'Creating...' : 'Create Donor Account'}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={ngoOrganization}
                      onChange={(e) => setNgoOrganization(e.target.value)}
                      placeholder="Organization name"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={ngoContact}
                      onChange={(e) => setNgoContact(e.target.value)}
                      placeholder="Contact person's name"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={ngoEmail}
                      onChange={(e) => setNgoEmail(e.target.value)}
                      placeholder="organization@example.com"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={ngoPhone}
                      onChange={(e) => setNgoPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Organization Type</label>
                    <select
                      value={ngoType}
                      onChange={(e) => setNgoType(e.target.value)}
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    >
                      <option value="NGO">NGO</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={ngoLocation}
                      onChange={(e) => setNgoLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={ngoPassword}
                      onChange={(e) => setNgoPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#173b5d] mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={ngoConfirmPassword}
                      onChange={(e) => setNgoConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full border border-[#dce7ee] bg-[#f8fbfd] rounded-[9px] p-3 text-[#173b5d] outline-none focus:border-[#087fc1]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-5 bg-[#087fc1] hover:bg-[#076fa9] text-white font-bold text-sm sm:text-base rounded-[9px] transition-all shadow-sm mt-3"
                  >
                    {loading ? 'Creating...' : 'Create Organization Account'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
