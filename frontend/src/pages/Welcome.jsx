import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-6">

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`px-3 py-1 rounded text-sm font-bold ${i18n.language === 'en' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'}`}
        >EN</button>
        <button
          onClick={() => i18n.changeLanguage('hi')}
          className={`px-3 py-1 rounded text-sm font-bold ${i18n.language === 'hi' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'}`}
        >हि</button>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="bg-white rounded-2xl px-8 py-4 mb-4 shadow-2xl">
          <span className="text-blue-900 text-5xl font-black tracking-tight">
            Nest<span className="text-green-500">Ease</span>
          </span>
        </div>
        <div className="flex gap-2 mb-3">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">VERIFIED</span>
          <span className="bg-white text-blue-900 px-3 py-1 rounded-full text-xs font-bold">RENTAL</span>
          <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-bold">PLATFORM</span>
        </div>
        <p className="font-playfair text-white text-2xl italic text-center">
          "Find Your Nest, With Ease"
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          onClick={() => navigate('/auth/mobile?role=owner')}
          className="bg-white text-blue-900 font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-blue-50 transition flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🏡</span>
          <span>{t('i_am_owner')}</span>
        </button>
        <button
          onClick={() => navigate('/auth/mobile?role=tenant')}
          className="bg-green-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🔍</span>
          <span>{t('i_am_tenant')}</span>
        </button>
      </div>

      {/* Bottom badges */}
      <div className="mt-12 flex gap-6 text-sm">
        <span className="text-green-400">✓ {t('broker_free')}</span>
        <span className="text-green-400">✓ {t('verified')}</span>
        <span className="text-green-400">✓ {t('transparent')}</span>
      </div>
    </div>
  );
}