import { useNavigate } from 'react-router-dom';

export default function DisputePanel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-orange-700 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">Dispute Resolution</h1>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <p className="text-5xl mb-4">⚖️</p>
        <p className="text-gray-700 font-bold text-lg">No disputes yet!</p>
        <p className="text-gray-400 text-sm mt-1">Tenant-owner disputes will appear here</p>
      </div>
    </div>
  );
}