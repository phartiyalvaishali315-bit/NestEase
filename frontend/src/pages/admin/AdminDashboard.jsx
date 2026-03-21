import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileSidebar from '../../components/ProfileSidebar';

export default function AdminDashboard() {
  const { user }                  = useAuth();
  const navigate                  = useNavigate();
  const [showProfile, setProfile] = useState(false);

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
          <button
            onClick={() => setProfile(true)}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-black text-lg hover:bg-opacity-30 transition border-2 border-white border-opacity-50"
          >
            {user?.full_name?.[0]?.toUpperCase() || 'A'}
          </button>
        </div>
      </nav>

      <ProfileSidebar isOpen={showProfile} onClose={() => setProfile(false)} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Admin Control Panel 🛡️</h2>
          <p className="text-gray-300 text-sm">Manage platform users, listings and payments</p>
        </div>

        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Admin Actions</h3>
        <div className="space-y-3">
          {[
            { icon: '🪪', title: 'KYC Approvals',      sub: 'Verify owner & tenant documents',   path: '/admin/kyc',      color: 'from-blue-900 to-blue-700' },
            { icon: '🏠', title: 'Property Approvals', sub: 'Review and approve listings',        path: '/admin/listings', color: 'from-green-800 to-green-600' },
            { icon: '💰', title: 'Escrow Payments',    sub: 'Manage and release held payments',   path: '/admin/escrow',   color: 'from-purple-800 to-purple-600' },
            { icon: '⚖️', title: 'Dispute Resolution', sub: 'Resolve tenant-owner disputes',      path: '/admin/disputes', color: 'from-orange-600 to-orange-500' },
            { icon: '👥', title: 'User Management',    sub: 'View and manage all users',          path: '/admin/users',    color: 'from-gray-800 to-gray-600' },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.path)}
              className={`w-full bg-gradient-to-r ${item.color} text-white rounded-xl px-5 py-4 flex items-center gap-4 shadow-md hover:shadow-lg transition text-left`}
            >
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{item.icon}</div>
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