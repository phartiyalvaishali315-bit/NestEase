import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, uploadMedia } from '../../api/properties';

export default function AddProperty() {
  const navigate          = useNavigate();
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos]   = useState([]);
  const [form, setForm]       = useState({
    title: '', description: '', property_type: 'room',
    address: '', city: '', state: '', pincode: '',
    latitude: '', longitude: '',
    monthly_rent: '', security_deposit: '',
    has_kitchen: false, bathroom_type: 'attached',
    sharing_type: 'single', is_women_only: false, is_pet_friendly: false,
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title || !form.monthly_rent || !form.city) {
      alert('Please fill Title, Rent and City!');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      const res = await createProperty(formData);
      if (photos.length > 0) {
        const mediaData = new FormData();
        photos.forEach(f => mediaData.append('images', f));
        await uploadMedia(res.data.id, mediaData);
      }
      alert('✅ Property submitted for admin approval!');
      navigate('/owner/properties');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to submit. Check all fields.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-xl font-bold">Add Property</h1>
        </div>
      </nav>

      {/* Step Indicator */}
      <div className="flex bg-white border-b">
        {['Basic', 'Location', 'Features', 'Photos'].map((s, i) => (
          <div key={i}
            className={`flex-1 text-center py-3 text-xs font-bold border-b-4 transition ${
              step === i+1 ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-400'
            }`}
          >{i+1}. {s}</div>
        ))}
      </div>

      <div className="max-w-lg mx-auto p-6">

        {/* Step 1 — Basic */}
        {step === 1 && (
          <div className="space-y-4">
            <select value={form.property_type}
              onChange={e => update('property_type', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500">
              <option value="room">🛏 Room</option>
              <option value="pg">🏠 PG</option>
              <option value="hostel">🏢 Hostel</option>
            </select>
            <input placeholder="Property Title *" value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500" />
            <textarea placeholder="Description *" value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={3} className="w-full border rounded-xl p-3 outline-none focus:border-blue-500 resize-none" />
            <input placeholder="Monthly Rent (₹) *" type="number" value={form.monthly_rent}
              onChange={e => update('monthly_rent', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500" />
            <input placeholder="Security Deposit (₹)" type="number" value={form.security_deposit}
              onChange={e => update('security_deposit', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500" />
            <button onClick={() => {
              if (!form.title || !form.monthly_rent) {
                alert('Title aur Rent zaruri hai!');
                return;
              }
              setStep(2);
            }} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl">Next →</button>
          </div>
        )}

        {/* Step 2 — Location */}
        {step === 2 && (
          <div className="space-y-4">
            <textarea placeholder="Full Address *" value={form.address}
              onChange={e => update('address', e.target.value)}
              rows={2} className="w-full border rounded-xl p-3 outline-none focus:border-blue-500 resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="City *" value={form.city}
                onChange={e => update('city', e.target.value)}
                className="border rounded-xl p-3 outline-none focus:border-blue-500" />
              <input placeholder="State *" value={form.state}
                onChange={e => update('state', e.target.value)}
                className="border rounded-xl p-3 outline-none focus:border-blue-500" />
            </div>
            <input placeholder="Pincode *" value={form.pincode}
              onChange={e => update('pincode', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500" />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 text-sm font-bold mb-1">📍 Map Coordinates</p>
              <p className="text-blue-500 text-xs mb-3">Google Maps pe property dhundo → right click → coordinates copy karo</p>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Latitude (29.3444)" value={form.latitude}
                  onChange={e => update('latitude', e.target.value)}
                  className="border rounded-xl p-3 outline-none text-sm focus:border-blue-500" />
                <input placeholder="Longitude (79.5630)" value={form.longitude}
                  onChange={e => update('longitude', e.target.value)}
                  className="border rounded-xl p-3 outline-none text-sm focus:border-blue-500" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border-2 border-blue-900 text-blue-900 font-bold py-3 rounded-xl">← Back</button>
              <button onClick={() => {
                if (!form.city) { alert('City zaruri hai!'); return; }
                setStep(3);
              }} className="flex-1 bg-blue-900 text-white font-bold py-3 rounded-xl">Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 — Features */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
              {[
                { label: '🍳 Has Kitchen',   key: 'has_kitchen' },
                { label: '👩 Women Only',    key: 'is_women_only' },
                { label: '🐾 Pet Friendly',  key: 'is_pet_friendly' },
              ].map(({ label, key }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-gray-700">{label}</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-all ${form[key] ? 'bg-blue-900' : 'bg-gray-300'} relative cursor-pointer`}
                    onClick={() => update(key, !form[key])}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form[key] ? 'left-6' : 'left-0.5'}`} />
                  </div>
                </label>
              ))}
            </div>

            <select value={form.bathroom_type}
              onChange={e => update('bathroom_type', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500">
              <option value="attached">🚿 Attached Bathroom</option>
              <option value="shared">🚽 Shared Bathroom</option>
            </select>

            <select value={form.sharing_type}
              onChange={e => update('sharing_type', e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500">
              <option value="single">👤 Single</option>
              <option value="double">👥 Double Sharing</option>
              <option value="triple">👥 Triple Sharing</option>
            </select>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 border-2 border-blue-900 text-blue-900 font-bold py-3 rounded-xl">← Back</button>
              <button onClick={() => setStep(4)}
                className="flex-1 bg-blue-900 text-white font-bold py-3 rounded-xl">Next →</button>
            </div>
          </div>
        )}

        {/* Step 4 — Photos */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 font-bold text-sm">📸 Add Photos</p>
              <p className="text-blue-500 text-xs mt-1">Upload clear photos — tenants prefer properties with photos!</p>
            </div>

            <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={e => setPhotos(Array.from(e.target.files))} />
              <span className="text-4xl mb-3">📤</span>
              <p className="font-bold text-gray-600">Tap to upload photos</p>
              <p className="text-gray-400 text-sm mt-1">JPG, PNG — Multiple allowed</p>
            </label>

            {photos.length > 0 && (
              <div>
                <p className="text-green-600 font-bold text-sm mb-2">✅ {photos.length} photo(s) selected</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((f, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img src={URL.createObjectURL(f)} alt=""
                        className="w-24 h-24 object-cover rounded-xl border-2 border-green-400" />
                      <button
                        onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)}
                className="flex-1 border-2 border-blue-900 text-blue-900 font-bold py-3 rounded-xl">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                {loading ? '⏳ Submitting...' : '✅ Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}