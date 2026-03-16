import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendOTP } from '../../api/auth';

export default function MobileEntry() {
  const [mobile, setMobile]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();
  const [params]              = useSearchParams();
  const role                  = params.get('role') || 'tenant';

  const handleSend = async () => {
    if (mobile.length !== 10) {
      setError('Please enter valid 10 digit mobile number');
      return;
    }
    setLoading(true);
    try {
      await sendOTP(mobile, 'login');
      navigate(`/auth/otp?mobile=${mobile}&role=${role}`);
    } catch {
      setError('Failed to send OTP. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          {role === 'owner' ? '🏡 Owner Login' : '🔍 Tenant Login'}
        </h2>
        <p className="text-gray-500 mb-6">Enter your mobile number to continue</p>

        <div className="flex border rounded-lg overflow-hidden mb-4">
          <span className="bg-gray-100 px-3 flex items-center text-gray-600 font-bold">+91</span>
          <input
            type="tel" maxLength={10} value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
            placeholder="9876543210"
            className="flex-1 p-3 outline-none text-lg"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSend} disabled={loading}
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-800 transition disabled:opacity-50"
        >{loading ? 'Sending...' : 'Send OTP'}</button>
      </div>
    </div>
  );
}