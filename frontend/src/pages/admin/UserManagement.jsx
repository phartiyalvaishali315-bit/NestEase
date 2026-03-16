import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function UserManagement() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/api/auth/users/')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-gray-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">User Management</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-gray-700 font-bold">No users found!</p>
          </div>
        ) : users.map(u => (
          <div key={u.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{u.full_name || 'No name'}</p>
              <p className="text-gray-500 text-sm">📱 {u.mobile}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  u.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                  u.role === 'admin' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}>{u.role}</span>
                {u.is_kyc_verified && <span className="text-xs px-2 py-1 rounded-full font-bold bg-green-100 text-green-700">✅ KYC</span>}
                {u.is_blocked && <span className="text-xs px-2 py-1 rounded-full font-bold bg-red-100 text-red-700">🚫 Blocked</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-purple-600">Score: {u.trust_score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}