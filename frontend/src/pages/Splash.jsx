import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate('/welcome'), 2500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl px-8 py-4 mb-4 shadow-2xl">
        <span className="text-blue-900 text-5xl font-black tracking-tight">
          Nest<span className="text-green-500">Ease</span>
        </span>
      </div>
      <p className="font-playfair text-white text-2xl mb-8 italic text-center">
        "Find Your Nest, With Ease"
      </p>
      <div className="flex gap-4">
        <span className="text-green-400 text-sm">✓ Broker Free</span>
        <span className="text-green-400 text-sm">✓ Verified</span>
        <span className="text-green-400 text-sm">✓ Transparent</span>
      </div>
    </div>
  );
}