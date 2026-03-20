import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function TenantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  useEffect(() => {
    api.get('/api/bookings/')
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">My Bookings</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-gray-700 font-bold text-lg">No bookings yet!</p>
            <p className="text-gray-400 text-sm mt-1">Apply for properties to get bookings</p>
            <button
              onClick={() => navigate('/tenant/search')}
              className="mt-4 bg-green-700 text-white px-6 py-2 rounded-xl font-bold"
            >Search Properties</button>
          </div>
        ) : bookings.map(b => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-black text-green-800 text-lg">{b.booking_ref}</p>
                <p className="text-gray-600 font-bold">{b.property_title}</p>
                <p className="text-gray-500 text-sm">📅 From: {b.start_date}</p>
                <p className="text-gray-500 text-sm">👤 Owner: {b.owner_name}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                b.status === 'confirmed'  ? 'bg-green-100 text-green-700' :
                b.status === 'completed'  ? 'bg-blue-100 text-blue-700' :
                b.status === 'cancelled'  ? 'bg-red-100 text-red-700' :
                'bg-orange-100 text-orange-700'
              }`}>{b.status}</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-3 flex justify-between">
              <span className="text-gray-500 text-sm">Monthly Rent</span>
              <span className="font-bold text-gray-800">₹{b.monthly_rent}</span>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-3 flex justify-between">
              <span className="text-blue-600 text-sm">Advance (50%)</span>
              <span className="font-bold text-blue-700">₹{b.advance_amount}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate(`/tenant/pay/${b.id}`)}
                className="flex-1 bg-gradient-to-r from-green-700 to-green-600 text-white py-2 rounded-xl font-bold text-sm"
              >💳 Pay Advance</button>
              <button
                onClick={() => navigate('/tenant/chat')}
                className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-bold text-sm"
              >💬 Chat</button>
              {b.status === 'completed' && (
                <button
                  onClick={() => navigate(`/tenant/review/${b.id}`)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-xl font-bold text-sm"
                >⭐ Review</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}