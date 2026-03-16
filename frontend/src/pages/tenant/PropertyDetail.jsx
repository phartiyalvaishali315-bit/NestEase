import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getProperty } from '../../api/properties';
import { applyProperty } from '../../api/applications';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

export default function PropertyDetail() {
  const { id }                    = useParams();
  const navigate                  = useNavigate();
  const [prop, setProp]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [applying, setApply]      = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [nearby, setNearby]       = useState([]);
  const [form, setForm]           = useState({ message: '', move_in_date: '' });

  useEffect(() => {
    getProperty(id)
      .then(res => {
        setProp(res.data);
        if (res.data.latitude && res.data.longitude) {
          fetchNearby(res.data.latitude, res.data.longitude);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const fetchNearby = async (lat, lng) => {
    try {
      const types = ['hospital', 'college', 'supermarket', 'restaurant', 'bus_stop'];
      const results = [];
      for (const type of types) {
        const url = `https://nominatim.openstreetmap.org/search?q=${type}&lat=${lat}&lon=${lng}&format=json&limit=2&bounded=1&viewbox=${lng-0.05},${lat+0.05},${lng+0.05},${lat-0.05}`;
        const res = await fetch(url);
        const data = await res.json();
        data.forEach(d => results.push({
          name: d.display_name.split(',')[0],
          type,
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon),
        }));
      }
      setNearby(results);
    } catch { }
  };

  const handleApply = async () => {
    if (!form.move_in_date) return alert('Please select move-in date!');
    setApply(true);
    try {
      await applyProperty({ property: id, ...form });
      alert('✅ Application submitted!');
      navigate('/tenant/applications');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to apply.');
    }
    setApply(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!prop) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Property not found!</p>
    </div>
  );

  const hasLocation = prop.latitude && prop.longitude &&
    parseFloat(prop.latitude) !== 0 && parseFloat(prop.longitude) !== 0;

  const nearbyIcons = {
    hospital:    '🏥',
    college:     '🎓',
    supermarket: '🛒',
    restaurant:  '🍽️',
    bus_stop:    '🚌',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Property Details</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-4 pb-36">

        {/* Photos */}
        {prop.media && prop.media.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
            {prop.media.map((m, i) => (
              <img key={i} src={m.image_url} alt="property"
                className="w-64 h-44 object-cover rounded-2xl flex-shrink-0 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl h-40 flex items-center justify-center mb-4">
            <span className="text-white text-5xl">🏠</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">{prop.property_type}</span>
              <h2 className="text-xl font-bold text-gray-800 mt-2">{prop.title}</h2>
              <p className="text-gray-500 text-sm">📍 {prop.city}, {prop.state}</p>
            </div>
            <div className="text-right">
              <p className="text-green-700 font-black text-2xl">₹{prop.monthly_rent}</p>
              <p className="text-gray-400 text-xs">/month</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">{prop.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
          {['details', 'map', 'nearby'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-green-700 text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >{tab === 'nearby' ? '📍 Nearby' : tab === 'map' ? '🗺️ Map' : '📋 Details'}</button>
          ))}
        </div>

        {/* Tab: Details */}
        {activeTab === 'details' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['💰 Monthly Rent',     `₹${prop.monthly_rent}`],
                  ['🔒 Security Deposit', `₹${prop.security_deposit}`],
                  ['🏠 Type',             prop.property_type?.toUpperCase()],
                  ['👥 Sharing',          prop.sharing_type],
                  ['🚿 Bathroom',         prop.bathroom_type],
                  ['🍳 Kitchen',          prop.has_kitchen ? 'Available' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="font-bold text-gray-800 text-sm capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {prop.is_women_only   && <span className="bg-pink-50 text-pink-600 px-3 py-2 rounded-xl text-sm">👩 Women Only</span>}
                {prop.is_pet_friendly && <span className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-sm">🐾 Pet Friendly</span>}
                {prop.has_kitchen     && <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-xl text-sm">🍳 Kitchen</span>}
                <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-sm">🚿 {prop.bathroom_type} Bath</span>
                <span className="bg-purple-50 text-purple-600 px-3 py-2 rounded-xl text-sm">👥 {prop.sharing_type}</span>
              </div>
            </div>
          </>
        )}

        {/* Tab: Map */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4 border border-gray-100">
            {hasLocation ? (
              <MapContainer
                center={[parseFloat(prop.latitude), parseFloat(prop.longitude)]}
                zoom={15}
                style={{ height: '350px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <Marker position={[parseFloat(prop.latitude), parseFloat(prop.longitude)]}>
                  <Popup>
                    <strong>{prop.title}</strong><br />
                    ₹{prop.monthly_rent}/mo
                  </Popup>
                </Marker>
                <Circle
                  center={[parseFloat(prop.latitude), parseFloat(prop.longitude)]}
                  radius={500}
                  color="green"
                  fillOpacity={0.1}
                />
                {nearby.map((n, i) => (
                  <Marker key={i} position={[n.lat, n.lng]} icon={redIcon}>
                    <Popup>{nearbyIcons[n.type]} {n.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-400">📍 Location not available</p>
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-600 text-sm">📍 {prop.address}, {prop.city} - {prop.pincode}</p>
            </div>
          </div>
        )}

        {/* Tab: Nearby */}
        {activeTab === 'nearby' && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-4">Nearby Places</h3>
            {nearby.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Loading nearby places...</p>
            ) : (
              <div className="space-y-3">
                {nearby.map((n, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{nearbyIcons[n.type]}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{n.name}</p>
                      <p className="text-gray-500 text-xs capitalize">{n.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-2xl mx-auto">
          {!showApply ? (
            <button
              onClick={() => setShowApply(true)}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-4 rounded-xl text-lg"
            >✅ Apply for this Property</button>
          ) : (
            <div className="space-y-2">
              <input type="date"
                value={form.move_in_date}
                onChange={e => setForm({ ...form, move_in_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border rounded-xl p-3 outline-none text-sm"
              />
              <textarea
                placeholder="Introduce yourself..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={2}
                className="w-full border rounded-xl p-3 outline-none text-sm resize-none"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowApply(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-bold text-sm">Cancel</button>
                <button onClick={handleApply} disabled={applying}
                  className="w-2/3 bg-green-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50">
                  {applying ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}