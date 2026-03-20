import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ListingQueue() {
  const [props, setProps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  const fetchProps = async () => {
    try {
      const res = await api.get('/api/properties/admin/pending/');
      setProps(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchProps(); }, []);

  const handle = async (id, action, reason = '') => {
    try {
      await api.patch(`/api/properties/admin/${id}/review/`, { action, reason });
      await fetchProps();
    } catch (e) {
      alert('Failed: ' + (e.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Property Approvals</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : props.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-gray-700 font-bold text-lg">No pending listings!</p>
          </div>
        ) : props.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{p.title}</h3>
                <p className="text-gray-500 text-sm">📍 {p.city}, {p.state}</p>
                <p className="text-gray-500 text-sm">💰 ₹{p.monthly_rent}/mo • {p.property_type}</p>
                <p className="text-gray-500 text-sm">👤 {p.owner_name}</p>
              </div>
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">pending</span>
            </div>

            {p.description && (
              <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-xl">{p.description}</p>
            )}

            {p.media && p.media.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-4">
                {p.media.map((m, i) => (
                  <img key={i} src={m.image_url} alt=""
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handle(p.id, 'approve')}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-bold"
              >✅ Approve</button>
              <button
                onClick={() => {
                  const r = prompt('Rejection reason?');
                  if (r) handle(p.id, 'reject', r);
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-400 text-white py-3 rounded-xl font-bold"
              >❌ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}