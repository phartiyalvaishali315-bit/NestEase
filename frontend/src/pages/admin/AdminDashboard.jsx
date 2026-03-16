import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-1">
              <span className="text-blue-900 font-black text-lg">Nest<span className="text-green-500">Ease</span></span>
            </div>
            <span className="bg-red-500 text-xs px-2 py-1 rounded-full font-bold">ADMIN</span>
          </div>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Admin Control Panel 🛡️</h2>
          <p className="text-gray-300 text-sm">Manage platform users, listings and payments</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Pending KYC', value: '0', color: 'bg-orange-500' },
              { label: 'Pending Listings', value: '0', color: 'bg-blue-500' },
              { label: 'Held Payments', value: '0', color: 'bg-green-500' },
            ].map((s, i) => (
              <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Admin Actions</h3>
        <div className="space-y-3">
          {[
            { icon: '🪪', title: 'KYC Approvals', sub: 'Verify owner & tenant documents', path: '/admin/kyc', color: 'from-blue-900 to-blue-700' },
            { icon: '🏠', title: 'Property Approvals', sub: 'Review and approve listings', path: '/admin/listings', color: 'from-green-800 to-green-600' },
            { icon: '💰', title: 'Escrow Payments', sub: 'Manage and release held payments', path: '/admin/escrow', color: 'from-purple-800 to-purple-600' },
            { icon: '⚖️', title: 'Dispute Resolution', sub: 'Resolve tenant-owner disputes', path: '/admin/disputes', color: 'from-orange-600 to-orange-500' },
            { icon: '👥', title: 'User Management', sub: 'Block/unblock users', path: '/admin/users', color: 'from-gray-800 to-gray-600' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`w-full bg-gradient-to-r ${item.color} text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md hover:shadow-lg transition text-left`}
            >
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">{item.title}</p>
                <p className="text-sm opacity-70">{item.sub}</p>
              </div>
              <span className="opacity-50 text-lg">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}