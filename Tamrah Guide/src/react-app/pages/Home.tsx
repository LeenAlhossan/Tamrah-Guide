import { useEffect } from 'react';
import { LanguageProvider } from '@/react-app/hooks/useLanguage';
import { useDateTypes } from '@/react-app/hooks/useDateTypes';
import Header from '@/react-app/components/Header';
import DateCard from '@/react-app/components/DateCard';
import PriceCalculator from '@/react-app/components/PriceCalculator';
import SmartRecommendations from '@/react-app/components/SmartRecommendations';
import { Loader2, Calendar, MapPin } from 'lucide-react';

function HomeContent() {
  const { dateTypes, loading, error } = useDateTypes();

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin mb-4">
            <Loader2 className="w-12 h-12 text-amber-600" />
          </div>
          <p className="text-amber-800 font-medium">Loading date varieties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calendar className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome to Qassim Dates Festival
              </h1>
            </div>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              Discover the finest Saudi date varieties with our smart guide. Compare tastes, 
              calculate prices, and get personalized recommendations for the perfect date selection.
            </p>
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Qassim Province, Saudi Arabia</span>
            </div>
          </div>
        </div>

        {/* Date Types Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Explore Saudi Date Varieties
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dateTypes.map((dateType) => (
              <DateCard key={dateType.id} dateType={dateType} />
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Price Calculator */}
          <div>
            <PriceCalculator dateTypes={dateTypes} />
          </div>

          {/* Smart Recommendations */}
          <div>
            <SmartRecommendations />
          </div>
        </div>

        {/* Festival Info */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Visit Qassim Dates Festival</h3>
              <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                Experience the rich tradition of Saudi date cultivation at the annual Qassim Dates Festival. 
                Taste premium varieties, meet local farmers, and discover the heritage behind each date.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm">Annual Event</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm">Qassim Province</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm">Cultural Experience</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Tamrah Guide. Bringing you closer to the finest Saudi dates.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}
