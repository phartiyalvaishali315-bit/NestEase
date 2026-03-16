import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function EscrowPanel() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  useEffect(() => {
    api.get('/api/payments/admin/escrow/')
      .then(res => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handle = async (id, action) => {
    await api.patch(`/api/payments/${id}/action/`, { action });
    const res = await api.get('/api/payments/admin/escrow/');
    setPayments(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-purple-800 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-purple-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Escrow Payments</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">💰</p>
            <p className="text-gray-700 font-bold text-lg">No held payments!</p>
          </div>
        ) : payments.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-800">Ref: {p.transaction_ref}</p>
                <p className="text-gray-500 text-sm">💰 Amount: ₹{p.amount}</p>
                <p className="text-gray-500 text-sm">📋 Type: {p.payment_type}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">{p.escrow_status}</span>
            </div>
            {p.escrow_status === 'held' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handle(p.id, 'release')}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-xl font-bold text-sm"
                >✅ Release</button>
                <button
                  onClick={() => handle(p.id, 'refund')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-400 text-white py-2 rounded-xl font-bold text-sm"
                >↩️ Refund</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}