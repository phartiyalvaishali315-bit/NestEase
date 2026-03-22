import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedApplications, reviewApplication } from '../../api/applications';
import { showToast } from '../../components/Toast';
export default function OwnerApplications() {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    getReceivedApplications()
      .then(res => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handle = async (id, action) => {
    const reason = action === 'reject' ? prompt('Reason for rejection?') : '';
    await reviewApplication(id, action, reason);
    const res = await getReceivedApplications();
    setApps(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="text-xl font-bold">Tenant Applications</h1>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {loading ? <p className="text-center">Loading...</p> :
         apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500">No applications yet!</p>
          </div>
        ) : apps.map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold text-blue-900">{app.tenant_name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                app.status === 'approved' ? 'bg-green-100 text-green-700' :
                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-orange-100 text-orange-700'
              }`}>{app.status}</span>
            </div>
            <p className="text-gray-500 text-sm">📱 {app.tenant_mobile}</p>
            <p className="text-gray-500 text-sm">🏠 {app.property_title}</p>
            <p className="text-gray-500 text-sm">📅 Move-in: {app.move_in_date}</p>
            {app.message && <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">"{app.message}"</p>}

            {app.status === 'pending' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handle(app.id, 'approve')}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold text-sm"
                >✅ Approve</button>
                <button
                  onClick={() => handle(app.id, 'reject')}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold text-sm"
                >❌ Reject</button>
                  showToast('Application approved! Booking created.', 'success');
                     // ya
                  showToast('Application rejected.', 'error');
                <button
                  onClick={() => navigate(`/owner/chat/${app.id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-bold text-sm"
                >💬 Chat</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}