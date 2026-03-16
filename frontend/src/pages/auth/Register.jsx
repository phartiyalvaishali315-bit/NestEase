import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm]       = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const { setUser }           = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async () => {
    if (!form.full_name) return alert('Please enter your name');
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      navigate('/kyc/upload');
    } catch {
      alert('Failed to save. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Complete Profile</h2>
        <p className="text-gray-500 mb-6">Just a few more details!</p>

        <input
          type="text" placeholder="Full Name *"
          value={form.full_name}
          onChange={e => setForm({ ...form, full_name: e.target.value })}
          className="w-full border rounded-lg p-3 mb-4 outline-none focus:border-blue-500"
        />
        <input
          type="email" placeholder="Email Address (optional)"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-lg p-3 mb-6 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSubmit} disabled={loading}
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-800 transition disabled:opacity-50"
        >{loading ? 'Saving...' : 'Continue →'}</button>
      </div>
    </div>
  );
}