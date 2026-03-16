import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TenantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{user?.full_name || 'Tenant'}</p>
              <p className="text-green-200 text-xs">{user?.mobile}</p>
            </div>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm transition">Logout</button>
          </div>
        </div>
      </nav>

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
            <button
              onClick={() => navigate('/kyc/upload')}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition"
            >Verify Now</button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.full_name?.split(' ')[0] || 'Tenant'}! 👋</h2>
          <p className="text-green-200 text-sm">Find your perfect home today</p>

          {/* Search Button */}
          <button
            onClick={() => navigate('/tenant/search')}
            className="mt-4 w-full bg-white rounded-xl p-3 flex items-center gap-3 hover:bg-green-50 transition"
          >
            <span className="text-xl">🔍</span>
            <span className="text-gray-400">Search rooms, PGs, hostels...</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Applications', value: '0', icon: '📋', color: 'from-blue-500 to-blue-600' },
            { label: 'Bookings', value: '0', icon: '📅', color: 'from-green-500 to-green-600' },
            { label: 'Trust Score', value: user?.trust_score || 0, icon: '⭐', color: 'from-purple-500 to-purple-600' },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white shadow-md text-center`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-black mt-1">{s.value}</p>
              <p className="text-white text-xs opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="space-y-3">
          {[
            { icon: '🔍', title: 'Search Properties', sub: 'Find rooms, PGs & hostels near you', path: '/tenant/search', bg: 'bg-gradient-to-r from-green-800 to-green-600', text: 'text-white' },
            { icon: '📋', title: 'My Applications', sub: 'Track your property applications', path: '/tenant/applications', bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
            { icon: '📅', title: 'My Bookings', sub: 'View confirmed bookings', path: '/tenant/bookings', bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
            { icon: '💬', title: 'Messages', sub: 'Chat with property owners', path: '/tenant/chat', bg: 'bg-white border border-gray-200', text: 'text-gray-800' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full ${item.bg} ${item.text} rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition text-left`}
            >
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
      </div>
    </div>
  );
}