import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function WriteReview() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rating: 5,
    cleanliness: 5,
    owner_behaviour: 5,
    value_for_money: 5,
    comment: '',
  });

  const handleSubmit = async () => {
    if (!form.comment) {
      alert('Please write a comment!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/reviews/', { ...form, booking: bookingId });
      alert('✅ Review submitted! Thank you!');
      navigate('/tenant/bookings');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to submit review.');
    }
    setLoading(false);
  };

  const StarRow = ({ label, key }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span className="text-gray-700 font-bold text-sm">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(star => (
          <button key={star}
            onClick={() => setForm({ ...form, [key]: star })}
            className={`text-2xl transition ${form[key] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          >★</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Write Review</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-bold text-gray-800 text-xl mb-1">Rate your experience</h2>
          <p className="text-gray-500 text-sm mb-4">Help other tenants make better decisions!</p>

          <StarRow label="Overall Rating"    key="rating" />
          <StarRow label="Cleanliness"       key="cleanliness" />
          <StarRow label="Owner Behaviour"   key="owner_behaviour" />
          <StarRow label="Value for Money"   key="value_for_money" />

          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Review *</label>
            <textarea
              placeholder="Share your experience about this property..."
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={4}
              className="w-full border rounded-xl p-3 outline-none focus:border-green-500 resize-none text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50"
          >{loading ? '⏳ Submitting...' : '⭐ Submit Review'}</button>
        </div>
      </div>
    </div>
  );
}