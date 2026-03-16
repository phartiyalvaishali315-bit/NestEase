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
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    pending:   'bg-orange-100 text-orange-700',
    approved:  'bg-green-100 text-green-700',
    rejected:  'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-700',
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="text-xl font-bold">My Applications</h1>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? <p className="text-center">Loading...</p> :
         apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500">No applications yet!</p>
            <button
              onClick={() => navigate('/tenant/search')}
              className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
            >Search Properties</button>
          </div>
        ) : apps.map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold text-green-800">{app.property_title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(app.status)}`}>
                {app.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm">📍 {app.property_city}</p>
            <p className="text-gray-500 text-sm">📅 Move-in: {app.move_in_date}</p>
            {app.status === 'approved' && (
              <button
                onClick={() => navigate(`/tenant/chat/${app.id}`)}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-sm"
              >💬 Chat with Owner</button>
            )}
            {app.rejection_reason && (
              <p className="text-red-500 text-sm mt-2">Reason: {app.rejection_reason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}