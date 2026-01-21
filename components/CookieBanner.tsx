
import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 z-50 animate-bounce-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold mb-2 flex items-center">
          <i className="fas fa-cookie-bite text-orange-500 mr-2"></i>
          Cookie & Privasi
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Website ini menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik. Dengan melanjutkan, Anda setuju dengan penggunaan kami.
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={accept} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition">
            Setuju & Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
