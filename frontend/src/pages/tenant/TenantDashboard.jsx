import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileSidebar from '../../components/ProfileSidebar';

export default function TenantDashboard() {
  const { user }                  = useAuth();
  const navigate                  = useNavigate();
  const [showProfile, setProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-3 py-1">
              <span className="text-blue-900 font-black text-lg">Nest<span className="text-green-500">Ease</span></span>
            </div>
            <span className="bg-green-700 text-xs px-2 py-1 rounded-full">Tenant</span>
          </div>

          {/* Profile Avatar */}
          <button onClick={() => setProfile(true)}
            className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-white border-opacity-60 hover:border-opacity-100 transition">
            {user?.profile_photo_url ? (
              <img src={user.profile_photo_url} alt="profile"
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white bg-opacity-20 flex items-center justify-center text-white font-black text-lg">
                {user?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </button>
        </div>
      </nav>

      <ProfileSidebar isOpen={showProfile} onClose={() => setProfile(false)} />

      <div className="max-w-4xl mx-auto p-6">

        {/* KYC Warning */}
        {!user?.is_kyc_verified && (
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-4 rounded-xl mb-6 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold">KYC Verification Pending</p>
                <p className="text-orange-100 text-sm">Complete KYC to apply for properties</p>
              </div>
            </div>
            <button onClick={() => navigate('/kyc/upload')}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg text-sm font-bold">Verify Now</button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.full_name?.split(' ')[0] || 'Tenant'}! 👋</h2>
          <p className="text-green-200 text-sm">Find your perfect home today</p>
          <button onClick={() => navigate('/tenant/search')}
            className="mt-4 w-full bg-white rounded-xl p-3 flex items-center gap-3 hover:bg-green-50 transition">
            <span className="text-xl">🔍</span>
            <span className="text-gray-400">Search rooms, PGs, hostels...</span>
          </button>
        </div>

        {/* Quick Actions */}
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="space-y-3">
          {[
            { icon: '🔍', title: 'Search Properties', sub: 'Find rooms, PGs & hostels near you', path: '/tenant/search',       bg: 'bg-gradient-to-r from-green-800 to-green-600', text: 'text-white' },
            { icon: '📋', title: 'My Applications',   sub: 'Track your property applications',   path: '/tenant/applications', bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
            { icon: '📅', title: 'My Bookings',       sub: 'View confirmed bookings',            path: '/tenant/bookings',     bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
            { icon: '💬', title: 'Messages',          sub: 'Chat with property owners',          path: '/tenant/chat',         bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)}
              className={`w-full ${item.bg} ${item.text} rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition text-left`}>
              <div className="w-12 h-12 rounded-xl bg-black bg-opacity-10 flex items-center justify-center text-2xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">{item.title}</p>
                <p className="text-sm opacity-60">{item.sub}</p>
              </div>
              <span className="opacity-40 text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Trust Score */}
        <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">Trust Score</h3>
            <span className="text-green-700 font-bold text-lg">{user?.trust_score || 0}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 rounded-full h-2"
              style={{ width: `${user?.trust_score || 0}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}