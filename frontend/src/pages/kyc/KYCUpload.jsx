import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function KYCUpload() {
  const [files, setFiles]       = useState({ aadhaar_front: null, aadhaar_back: null, selfie_with_doc: null });
  const [loading, setLoading]   = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  useEffect(() => {
    api.get('/api/kyc/')
      .then(res => setKycStatus(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!files.aadhaar_front || !files.aadhaar_back) {
      setError('Please upload both Aadhaar front and back!');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('aadhaar_front', files.aadhaar_front);
    formData.append('aadhaar_back',  files.aadhaar_back);
    if (files.selfie_with_doc) formData.append('selfie_with_doc', files.selfie_with_doc);
    try {
      await api.post('/api/kyc/', formData);
      alert('✅ KYC submitted! Admin will verify within 24 hours.');
      navigate(-1);
    } catch (e) {
      setError(e.response?.data?.error || 'Upload failed. Try again.');
    }
    setLoading(false);
  };

  const FileUploadBox = ({ label, required, fileKey, emoji }) => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {emoji} {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center cursor-pointer transition ${files[fileKey] ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
        <input type="file" accept="image/*" className="hidden"
          onChange={e => setFiles({ ...files, [fileKey]: e.target.files[0] })} />
        {files[fileKey] ? (
          <>
            <span className="text-3xl mb-2">✅</span>
            <p className="text-green-600 font-bold text-sm">{files[fileKey].name}</p>
          </>
        ) : (
          <>
            <span className="text-3xl mb-2">📤</span>
            <p className="text-gray-500 font-bold text-sm">Tap to upload</p>
            <p className="text-gray-400 text-xs mt-1">JPG, PNG supported</p>
          </>
        )}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="bg-blue-800 w-8 h-8 rounded-lg flex items-center justify-center">←</button>
          <h1 className="text-lg font-bold">KYC Verification</h1>
        </div>
      </nav>

      <div className="max-w-md mx-auto p-6">

        {/* KYC Status */}
        {kycStatus && kycStatus.status !== 'not_submitted' && (
          <div className={`rounded-xl p-4 mb-4 ${
            kycStatus.status === 'approved' ? 'bg-green-50 border border-green-200' :
            kycStatus.status === 'rejected' ? 'bg-red-50 border border-red-200' :
            'bg-orange-50 border border-orange-200'
          }`}>
            <p className={`font-bold text-sm ${
              kycStatus.status === 'approved' ? 'text-green-700' :
              kycStatus.status === 'rejected' ? 'text-red-700' :
              'text-orange-700'
            }`}>
              {kycStatus.status === 'approved' ? '✅ KYC Verified!' :
               kycStatus.status === 'rejected' ? '❌ KYC Rejected' :
               '⏳ KYC Under Review'}
            </p>
            {kycStatus.status === 'rejected' && kycStatus.rejection_reason && (
              <p className="text-red-600 text-sm mt-1">Reason: {kycStatus.rejection_reason}</p>
            )}
            {kycStatus.status === 'pending' && (
              <p className="text-orange-600 text-sm mt-1">Admin is reviewing your documents</p>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <p className="font-bold text-blue-800 text-sm">Why KYC?</p>
            <p className="text-blue-600 text-xs mt-1">KYC verification ensures platform safety and builds trust.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Upload Documents</h2>
          <p className="text-gray-500 text-sm mb-6">Upload clear photos of your Aadhaar card</p>

          <FileUploadBox label="Aadhaar Front" required fileKey="aadhaar_front" emoji="🪪" />
          <FileUploadBox label="Aadhaar Back"  required fileKey="aadhaar_back"  emoji="🪪" />
          <FileUploadBox label="Selfie with Aadhaar" fileKey="selfie_with_doc" emoji="🤳" />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-lg">
            {loading ? '⏳ Uploading...' : '🚀 Submit KYC'}
          </button>
        </div>
      </div>
    </div>
  );
}