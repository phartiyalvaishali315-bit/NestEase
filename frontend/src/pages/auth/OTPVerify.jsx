import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOTP } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function OTPVerify() {
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();
  const [params]              = useSearchParams();
  const { login }             = useAuth();
  const mobile                = params.get('mobile');
  const role                  = params.get('role') || 'tenant';

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Enter 6 digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOTP(mobile, otp, 'login', role);
      login(
        { access: res.data.access, refresh: res.data.refresh },
        res.data.user
      );

      const userRole = res.data.user.role;

      if (res.data.is_new_user) {
        navigate('/auth/register');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    } catch {
      setError('Invalid OTP. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Verify OTP</h2>
        <p className="text-gray-500 mb-2">OTP sent to <strong>+91 {mobile}</strong></p>
        <p className="text-orange-500 text-sm mb-6">
          💡 Check VS Code terminal for OTP
        </p>

        <input
          type="tel" maxLength={6} value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6 digit OTP"
          className="w-full border rounded-lg p-3 text-center text-2xl tracking-widest mb-4 outline-none focus:border-blue-500"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleVerify} disabled={loading}
          className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-800 transition disabled:opacity-50"
        >{loading ? 'Verifying...' : 'Verify OTP'}</button>
      </div>
    </div>
  );
}