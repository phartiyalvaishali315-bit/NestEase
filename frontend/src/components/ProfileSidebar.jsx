import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProfileSidebar({ isOpen, onClose }) {
  const { user, setUser, logout } = useAuth();
  const navigate                  = useNavigate();
  const [editing, setEditing]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [form, setForm]           = useState({
    full_name: user?.full_name || '',
    email:     user?.email     || '',
  });
  const fileRef = useRef();

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.patch('/api/auth/me/', form);
      setUser(res.data);
      setEditing(false);
      alert('✅ Profile updated!');
    } catch {
      alert('Failed to update!');
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('profile_photo', file);
      const res = await api.patch('/api/auth/me/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      alert('✅ Photo updated!');
    } catch {
      alert('Failed to upload photo!');
    }
    setPhotoLoading(false);
  };

  if (!isOpen) return null;

  const roleColor = user?.role === 'owner' ? 'from-blue-900 to-blue-700' :
                    user?.role === 'admin'  ? 'from-gray-900 to-gray-700' :
                    'from-green-800 to-green-600';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">

        {/* Header */}
        <div className={`p-6 bg-gradient-to-br ${roleColor}`}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-white text-sm font-bold opacity-70">My Profile</span>
            <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 text-xl">✕</button>
          </div>

          {/* Avatar + Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              {user?.profile_photo_url ? (
                <img src={user.profile_photo_url} alt="profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white border-opacity-50" />
              ) : (
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-4xl font-black border-4 border-white border-opacity-30">
                  {user?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
              )}

              {/* Camera button */}
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
              >
                {photoLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-sm">📷</span>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={handlePhotoUpload} />
            </div>

            <h2 className="text-white font-bold text-lg">{user?.full_name || 'User'}</h2>
            <p className="text-white opacity-70 text-sm">+91 {user?.mobile}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full capitalize">{user?.role}</span>
              {user?.is_kyc_verified && (
                <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full font-bold">✅ KYC</span>
              )}
            </div>
          </div>
        </div>

        {/* Trust Score */}
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm font-bold">Trust Score</span>
            <span className="font-black text-gray-800">{user?.trust_score || 0}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 rounded-full h-2 transition-all"
              style={{ width: `${user?.trust_score || 0}%` }} />
          </div>
        </div>

        {/* Edit Profile */}
        <div className="px-6 py-4 border-b flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Personal Details</h3>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="text-blue-600 text-sm font-bold hover:underline">✏️ Edit</button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-bold">Full Name</label>
                <input value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border rounded-xl p-3 text-sm outline-none focus:border-blue-500 mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold">Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-xl p-3 text-sm outline-none focus:border-blue-500 mt-1" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-2 rounded-xl text-sm font-bold">Cancel</button>
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-xl text-sm font-bold disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Mobile',     value: `+91 ${user?.mobile}`,                          icon: '📱' },
                { label: 'Email',      value: user?.email || 'Not added',                     icon: '📧' },
                { label: 'Role',       value: user?.role?.toUpperCase(),                       icon: '👤' },
                { label: 'KYC Status', value: user?.is_kyc_verified ? 'Verified ✅' : 'Pending ⚠️', icon: '🪪' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-bold text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 space-y-2 border-t">
          {!user?.is_kyc_verified && (
            <button onClick={() => { navigate('/kyc/upload'); onClose(); }}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm">
              ⚠️ Complete KYC
            </button>
          )}
          <button
            onClick={() => { logout(); onClose(); navigate('/welcome'); }}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-sm"
          >🚪 Logout</button>
        </div>
      </div>
    </>
  );
}