import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProperties, toggleAvailability } from '../../api/properties';

export default function MyProperties() {
  const [props, setProps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    getMyProperties()
      .then(res => setProps(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id) => {
    await toggleAvailability(id);
    const res = await getMyProperties();
    setProps(res.data);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>←</button>
          <h1 className="text-xl font-bold">My Properties</h1>
        </div>
        <button
          onClick={() => navigate('/owner/properties/add')}
          className="bg-white text-blue-900 px-3 py-1 rounded font-bold text-sm"
        >+ Add</button>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {props.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🏠</p>
            <p className="text-gray-500 text-lg">No properties yet!</p>
            <button
              onClick={() => navigate('/owner/properties/add')}
              className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg font-bold"
            >Add First Property</button>
          </div>
        ) : props.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-blue-900">{p.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                p.admin_status === 'approved' ? 'bg-green-100 text-green-700' :
                p.admin_status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-orange-100 text-orange-700'
              }`}>{p.admin_status}</span>
            </div>
            <p className="text-gray-500 text-sm mb-3">📍 {p.city} • {p.property_type} • ₹{p.monthly_rent}/mo</p>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(p.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${
                  p.availability === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >{p.availability === 'available' ? '✅ Available' : '🔴 Engaged'}</button>
              <button
                onClick={() => navigate(`/owner/applications?property=${p.id}`)}
                className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-bold"
              >📋 Applications</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}