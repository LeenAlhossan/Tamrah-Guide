import { Globe, Calendar, Crown } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useAuth } from '@getmocha/users-service/react';
import { Link } from 'react-router';

export default function Header() {
  const { language, setLanguage, isRTL } = useLanguage();
  const { user } = useAuth();

  const texts = {
    en: {
      title: 'Tamrah Guide',
      subtitle: 'Smart Date Selection for Qassim Festival',
      switchToArabic: 'العربية'
    },
    ar: {
      title: 'دليل التمر',
      subtitle: 'اختيار ذكي للتمور في مهرجان القصيم',
      switchToEnglish: 'English'
    }
  };

  const currentTexts = texts[language];

  return (
    <header className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-amber-200" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {currentTexts.title}
              </h1>
              <p className="text-amber-100 text-sm md:text-base opacity-90">
                {currentTexts.subtitle}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {user && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg hover:shadow-xl px-5 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300/30"
              >
                <Crown className="w-6 h-6 animate-pulse" />
                <span className="text-base font-bold tracking-wide">
                  {language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                </span>
              </Link>
            )}
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'en' ? texts.en.switchToArabic : texts.ar.switchToEnglish}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50"></div>
    </header>
  );
}
