import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProfileSidebar from '../../components/ProfileSidebar';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats, setStats]       = useState({ properties: 0, bookings: 0, applications: 0, earnings: 0 });
  const [showProfile, setProfile] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, appsRes, bookingsRes] = await Promise.all([
          api.get('/api/properties/mine/'),
          api.get('/api/applications/received/'),
          api.get('/api/bookings/'),
        ]);
        const earnings = bookingsRes.data
          .filter(b => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + parseFloat(b.monthly_rent || 0), 0);
        setStats({
          properties:   propsRes.data.length,
          applications: appsRes.data.length,
          bookings:     bookingsRes.data.length,
          earnings,
        });
      } catch { }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-3 py-1">
              <span className="text-blue-900 font-black text-lg">Nest<span className="text-green-500">Ease</span></span>
            </div>
            <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">Owner</span>
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setProfile(true)}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-black text-lg hover:bg-opacity-30 transition border-2 border-white border-opacity-50"
          >
            {user?.full_name?.[0]?.toUpperCase() || '?'}
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
                <p className="text-orange-100 text-sm">Complete KYC to start listing properties</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/kyc/upload')}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg text-sm font-bold"
            >Verify Now</button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Good day, {user?.full_name?.split(' ')[0] || 'Owner'}! 👋</h2>
          <p className="text-blue-200 text-sm">Manage your properties and tenant applications</p>
          <div className="mt-4 bg-blue-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-200">Trust Score</span>
              <span className="font-black text-xl">{user?.trust_score || 0}<span className="text-blue-300 text-sm">/100</span></span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-2">
              <div className="bg-green-400 rounded-full h-2" style={{ width: `${user?.trust_score || 0}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Properties',   value: stats.properties,     icon: '🏠', color: 'from-blue-500 to-blue-600' },
            { label: 'Bookings',     value: stats.bookings,       icon: '📅', color: 'from-green-500 to-green-600' },
            { label: 'Applications', value: stats.applications,   icon: '📋', color: 'from-orange-400 to-orange-500' },
            { label: 'Earnings',     value: `₹${stats.earnings}`, icon: '💰', color: 'from-purple-500 to-purple-600' },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white shadow-md`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-black mt-1">{s.value}</p>
              <p className="text-sm opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="space-y-3">
          {[
            { icon: '➕', title: 'Add New Property',    sub: 'List a Room, PG or Hostel',      path: '/owner/properties/add', bg: 'bg-gradient-to-r from-blue-900 to-blue-700', text: 'text-white' },
            { icon: '🏡', title: 'My Properties',       sub: 'View and manage your listings',  path: '/owner/properties',     bg: 'bg-white border border-gray-200', text: 'text-blue-900' },
            { icon: '📋', title: 'Tenant Applications', sub: 'Review and approve applications', path: '/owner/applications',  bg: 'bg-white border border-gray-200', text: 'text-blue-900' },
            { icon: '📅', title: 'Bookings',            sub: 'View confirmed bookings',        path: '/owner/bookings',       bg: 'bg-white border border-gray-200', text: 'text-blue-900' },
            { icon: '💬', title: 'Messages',            sub: 'Chat with tenants',              path: '/owner/chat',           bg: 'bg-white border border-gray-200', text: 'text-blue-900' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)}
              className={`w-full ${item.bg} ${item.text} rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition text-left`}
            >
              <div className="w-12 h-12 rounded-xl bg-black bg-opacity-10 flex items-center justify-center text-2xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1">
                <p className="font-bold text-base">{item.title}</p>
                <p className="text-sm opacity-60">{item.sub}</p>
              </div>
              <span className="opacity-40 text-lg">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}