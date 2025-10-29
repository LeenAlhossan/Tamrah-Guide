import { useState } from 'react';
import { Brain, Star, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { useRecommendations } from '@/react-app/hooks/useDateTypes';
import DateCard from './DateCard';

export default function SmartRecommendations() {
  const { language, isRTL } = useLanguage();
  const { recommendations, loading, getRecommendations } = useRecommendations();
  
  const [preferences, setPreferences] = useState({
    sweetness_preference: 3,
    texture_preference: 'any' as 'soft' | 'firm' | 'any',
    budget_max: 100,
    is_premium_preferred: false,
  });

  const texts = {
    en: {
      title: 'Smart Recommendations',
      subtitle: 'Get personalized date recommendations based on your preferences',
      sweetness: 'Preferred Sweetness Level',
      texture: 'Texture Preference',
      budget: 'Maximum Budget (SAR per kg)',
      premium: 'Prefer Premium Varieties',
      getRecommendations: 'Get Recommendations',
      noRecommendations: 'No recommendations found. Try adjusting your preferences.',
      textureOptions: {
        any: 'Any',
        soft: 'Soft',
        firm: 'Firm'
      },
      yes: 'Yes',
      no: 'No'
    },
    ar: {
      title: 'توصيات ذكية',
      subtitle: 'احصل على توصيات مخصصة للتمور بناءً على تفضيلاتك',
      sweetness: 'مستوى الحلاوة المفضل',
      texture: 'تفضيل الملمس',
      budget: 'الحد الأقصى للميزانية (ريال للكيلو)',
      premium: 'تفضيل الأصناف المميزة',
      getRecommendations: 'احصل على التوصيات',
      noRecommendations: 'لم يتم العثور على توصيات. جرب تعديل تفضيلاتك.',
      textureOptions: {
        any: 'أي ملمس',
        soft: 'ناعم',
        firm: 'ثابت'
      },
      yes: 'نعم',
      no: 'لا'
    }
  };

  const currentTexts = texts[language];

  const handleGetRecommendations = () => {
    getRecommendations({
      sweetness_preference: preferences.sweetness_preference,
      texture_preference: preferences.texture_preference,
      budget_max: preferences.budget_max,
      is_premium_preferred: preferences.is_premium_preferred,
    });
  };

  const renderStars = (level: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setPreferences(prev => ({ ...prev, sweetness_preference: i + 1 })) : undefined}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
      {/* Header */}
      <div className={`flex items-center space-x-3 mb-6 ${isRTL ? 'space-x-reverse' : ''}`}>
        <div className="bg-purple-100 p-3 rounded-xl">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{currentTexts.title}</h2>
          <p className="text-gray-600 text-sm">{currentTexts.subtitle}</p>
        </div>
      </div>

      {/* Preferences Form */}
      <div className="space-y-6 mb-6">
        {/* Sweetness Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {currentTexts.sweetness}
          </label>
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            {renderStars(preferences.sweetness_preference, true)}
            <span className="text-sm text-gray-500 ml-2">
              ({preferences.sweetness_preference}/5)
            </span>
          </div>
        </div>

        {/* Texture Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentTexts.texture}
          </label>
          <select
            value={preferences.texture_preference}
            onChange={(e) => setPreferences(prev => ({ 
              ...prev, 
              texture_preference: e.target.value as 'soft' | 'firm' | 'any'
            }))}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isRTL ? 'text-right' : ''
            }`}
          >
            <option value="any">{currentTexts.textureOptions.any}</option>
            <option value="soft">{currentTexts.textureOptions.soft}</option>
            <option value="firm">{currentTexts.textureOptions.firm}</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentTexts.budget}
          </label>
          <input
            type="number"
            value={preferences.budget_max}
            onChange={(e) => setPreferences(prev => ({ 
              ...prev, 
              budget_max: Number(e.target.value)
            }))}
            min="10"
            max="200"
            step="5"
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isRTL ? 'text-right' : ''
            }`}
          />
        </div>

        {/* Premium Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {currentTexts.premium}
          </label>
          <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, is_premium_preferred: true }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                preferences.is_premium_preferred
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {currentTexts.yes}
            </button>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, is_premium_preferred: false }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                !preferences.is_premium_preferred
                  ? 'bg-purple-100 border-purple-300 text-purple-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {currentTexts.no}
            </button>
          </div>
        </div>

        {/* Get Recommendations Button */}
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>{currentTexts.getRecommendations}</span>
            </>
          )}
        </button>
      </div>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'التوصيات المناسبة لك:' : 'Recommended for you:'}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((dateType) => (
              <div key={dateType.id} className="transform scale-95">
                <DateCard dateType={dateType} />
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{currentTexts.noRecommendations}</p>
        </div>
      )}
    </div>
  );
}
