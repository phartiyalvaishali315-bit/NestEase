import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getProperties } from '../../api/properties';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function PropertySearch() {
  const [props, setProps]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showFilter, setFilter] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters]   = useState({
    city: '', property_type: '', min_rent: '', max_rent: '',
    sharing_type: '', is_women_only: false, is_pet_friendly: false,
  });
  const navigate = useNavigate();

  const search = async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== false) params[k] = v;
    });
    try {
      const res = await getProperties(params);
      setProps(res.data);
    } catch { alert('Search failed'); }
    setLoading(false);
  };

  useEffect(() => { search(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="bg-green-700 hover:bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
            <h1 className="text-lg font-bold">Search Properties</h1>
          </div>
          <button
            onClick={() => setFilter(!showFilter)}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold transition ${showFilter ? 'bg-white text-green-800' : 'bg-green-700 text-white'}`}
          >🔧 Filters</button>
        </div>
      </nav>

      {/* View Toggle */}
      <div className="max-w-2xl mx-auto px-4 pt-3 flex gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${viewMode === 'list' ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >📋 List View</button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${viewMode === 'map' ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >🗺️ Map View</button>
      </div>

      {/* Filters Panel */}
      {showFilter && (
        <div className="bg-white border-b shadow-sm p-4 mt-2">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input placeholder="📍 City" value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
                className="border rounded-xl p-3 text-sm outline-none focus:border-green-500" />
              <select value={filters.property_type}
                onChange={e => setFilters({ ...filters, property_type: e.target.value })}
                className="border rounded-xl p-3 text-sm outline-none focus:border-green-500">
                <option value="">All Types</option>
                <option value="room">🛏 Room</option>
                <option value="pg">🏠 PG</option>
                <option value="hostel">🏢 Hostel</option>
              </select>
              <input placeholder="₹ Min Rent" type="number" value={filters.min_rent}
                onChange={e => setFilters({ ...filters, min_rent: e.target.value })}
                className="border rounded-xl p-3 text-sm outline-none focus:border-green-500" />
              <input placeholder="₹ Max Rent" type="number" value={filters.max_rent}
                onChange={e => setFilters({ ...filters, max_rent: e.target.value })}
                className="border rounded-xl p-3 text-sm outline-none focus:border-green-500" />
            </div>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filters.is_women_only}
                  onChange={e => setFilters({ ...filters, is_women_only: e.target.checked })}
                  className="w-4 h-4 accent-green-600" />
                <span>👩 Women Only</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filters.is_pet_friendly}
                  onChange={e => setFilters({ ...filters, is_pet_friendly: e.target.checked })}
                  className="w-4 h-4 accent-green-600" />
                <span>🐾 Pet Friendly</span>
              </label>
            </div>
            <button onClick={search}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3 rounded-xl font-bold">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4">

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-3 px-1">
            {props.length} {props.length === 1 ? 'property' : 'properties'} found
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Searching properties...</p>
          </div>
        ) : props.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-700 font-bold text-lg">No properties found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <>
            {/* Map View */}
            {viewMode === 'map' && (
              <div className="rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100">
                <MapContainer
                  center={
                    props.find(p => p.latitude && parseFloat(p.latitude) !== 0)
                      ? [parseFloat(props.find(p => p.latitude && parseFloat(p.latitude) !== 0).latitude),
                         parseFloat(props.find(p => p.latitude && parseFloat(p.latitude) !== 0).longitude)]
                      : [20.5937, 78.9629]
                  }
                  zoom={12}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  {props.filter(p => p.latitude && parseFloat(p.latitude) !== 0).map(p => (
                    <Marker key={p.id} position={[parseFloat(p.latitude), parseFloat(p.longitude)]}>
                      <Popup>
                        <div style={{ minWidth: '160px' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{p.title}</p>
                          <p style={{ color: 'green', marginBottom: '4px' }}>₹{p.monthly_rent}/mo</p>
                          <p style={{ fontSize: '12px', marginBottom: '8px' }}>{p.city}</p>
                          <button
                            onClick={() => navigate(`/tenant/property/${p.id}`)}
                            style={{ background: '#15803d', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer' }}
                          >View Details</button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {props.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/tenant/property/${p.id}`)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100"
                  >
                    {/* Photo or placeholder */}
                    {p.media && p.media.length > 0 ? (
                      <img src={p.media[0].image_url} alt={p.title}
                        className="w-full h-44 object-cover" />
                    ) : (
                      <div className="bg-gradient-to-r from-green-800 to-green-600 h-24 flex items-center justify-center">
                        <span className="text-white text-3xl">🏠</span>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-lg flex-1 pr-2">{p.title}</h3>
                        <div className="text-right">
                          <span className="text-green-700 font-black text-xl">₹{p.monthly_rent}</span>
                          <p className="text-gray-400 text-xs">/month</p>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mb-3">📍 {p.city}, {p.state}</p>

                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{p.sharing_type} sharing</span>
                        <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full">{p.bathroom_type} bath</span>
                        {p.has_kitchen    && <span className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full">🍳 Kitchen</span>}
                        {p.is_women_only  && <span className="bg-pink-50 text-pink-600 text-xs px-3 py-1 rounded-full">👩 Women Only</span>}
                        {p.is_pet_friendly && <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">🐾 Pet OK</span>}
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Deposit: ₹{p.security_deposit}</span>
                        <span className="text-green-700 text-sm font-bold">View Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}