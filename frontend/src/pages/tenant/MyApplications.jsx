import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications } from '../../api/applications';

export default function MyApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    getMyApplications()
      .then(res => setApps(res.data))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    pending:   'bg-orange-100 text-orange-700',
    approved:  'bg-green-100 text-green-700',
    rejected:  'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-700',
  }[s] || 'bg-gray-100 text-gray-700');

  const statusIcon = (s) => ({
    pending:   '⏳',
    approved:  '✅',
    rejected:  '❌',
    withdrawn: '↩️',
  }[s] || '📋');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">My Applications</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-700 font-bold text-lg">No applications yet!</p>
            <button
              onClick={() => navigate('/tenant/search')}
              className="mt-4 bg-green-700 text-white px-6 py-2 rounded-xl font-bold"
            >Search Properties</button>
          </div>
        ) : apps.map(app => (
          <div key={app.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-green-800 text-lg">{app.property_title}</h3>
                <p className="text-gray-500 text-sm">📍 {app.property_city}</p>
                <p className="text-gray-500 text-sm">📅 Move-in: {app.move_in_date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusColor(app.status)}`}>
                {statusIcon(app.status)} {app.status}
              </span>
            </div>

            {app.message && (
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl mb-3">
                "{app.message}"
              </p>
            )}

            {app.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                <p className="text-red-600 text-sm">❌ Reason: {app.rejection_reason}</p>
              </div>
            )}

            {app.status === 'approved' && (
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-green-700 text-sm font-bold">🎉 Application Approved!</p>
                  <p className="text-green-600 text-xs mt-1">Check your bookings to pay advance</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/tenant/bookings')}
                    className="flex-1 bg-green-700 text-white py-2 rounded-xl font-bold text-sm"
                  >📅 View Booking</button>
                  <button
                    onClick={() => navigate(`/tenant/chat`)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-bold text-sm"
                  >💬 Chat with Owner</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}