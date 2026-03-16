import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initiatePayment, payNow } from '../../api/payments';
import api from '../../api/axios';

export default function PayAdvance() {
  const { id }                  = useParams();
  const navigate                = useNavigate();
  const [booking, setBooking]   = useState(null);
  const [payment, setPayment]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);

  useEffect(() => {
    api.get(`/api/bookings/${id}/`)
      .then(res => setBooking(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInitiate = async () => {
    const res = await initiatePayment(id);
    setPayment(res.data);
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      await payNow(payment.id);
      alert('✅ Payment successful! Amount held in escrow.');
      navigate('/tenant/bookings');
    } catch {
      alert('Payment failed. Try again.');
    }
    setPaying(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-green-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Pay Advance</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto p-6">
        {booking && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Booking Summary</h3>
            <div className="space-y-3">
              {[
                ['Booking Ref', booking.booking_ref],
                ['Monthly Rent', `₹${booking.monthly_rent}`],
                ['Advance (50%)', `₹${booking.advance_amount}`],
                ['Start Date', booking.start_date],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-bold text-gray-800 text-sm">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
              <p className="text-blue-700 text-sm font-bold">🔒 Escrow Protection</p>
              <p className="text-blue-600 text-xs mt-1">Your payment will be held securely until move-in is confirmed</p>
            </div>
          </div>
        )}

        {!payment ? (
          <button
            onClick={handleInitiate}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-4 rounded-xl text-lg"
          >Initiate Payment</button>
        ) : (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50"
          >{paying ? '⏳ Processing...' : `💳 Pay ₹${payment.amount}`}</button>
        )}
      </div>
    </div>
  );
}