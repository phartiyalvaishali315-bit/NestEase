import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { showToast } from '../../components/Toast';

export default function KYCQueue() {
  const [kycs, setKycs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/api/kyc/admin/')
      .then(res => setKycs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handle = async (id, action) => {
    const reason = action === 'reject' ? prompt('Rejection reason?') : '';
    await api.patch(`/api/kyc/${id}/review/`, { action, reason });
    const res = await api.get('/api/kyc/admin/');
    setKycs(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="text-xl font-bold">KYC Approvals</h1>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? <p className="text-center">Loading...</p> :
         kycs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-gray-500">No pending KYC!</p>
          </div>
        ) : kycs.map(kyc => (
          <div key={kyc.id} className="bg-white rounded-xl shadow p-5">
            <p className="font-bold text-gray-800 mb-3">KYC #{kyc.id.slice(0,8)}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Aadhaar Front</p>
                <img src={kyc.aadhaar_front} alt="front"
                  className="w-full h-28 object-cover rounded-lg border" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Aadhaar Back</p>
                <img src={kyc.aadhaar_back} alt="back"
                  className="w-full h-28 object-cover rounded-lg border" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handle(kyc.id, 'approve')}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold"
              >✅ Approve</button>
              showToast('KYC Approved!', 'success');
              <button
                onClick={() => handle(kyc.id, 'reject')}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold"
              >❌ Reject</button>
              showToast('KYC Rejected.', 'error');
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}