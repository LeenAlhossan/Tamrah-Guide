import { DateType } from '@/shared/types';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Star, Sparkles } from 'lucide-react';

interface DateCardProps {
  dateType: DateType;
  onClick?: () => void;
}

export default function DateCard({ dateType, onClick }: DateCardProps) {
  const { language, isRTL } = useLanguage();

  const name = language === 'ar' ? dateType.name_ar : dateType.name_en;
  const description = language === 'ar' ? dateType.description_ar : dateType.description_en;
  const taste = language === 'ar' ? dateType.taste_profile_ar : dateType.taste_profile_en;
  const texture = language === 'ar' ? dateType.texture_ar : dateType.texture_en;
  const size = language === 'ar' ? dateType.size_ar : dateType.size_en;
  const features = language === 'ar' ? dateType.key_features_ar : dateType.key_features_en;
  const region = language === 'ar' ? dateType.origin_region_ar : dateType.origin_region_en;

  const texts = {
    en: {
      priceLabel: 'Price per kg',
      sweetnessLabel: 'Sweetness',
      textureLabel: 'Texture',
      sizeLabel: 'Size',
      featuresLabel: 'Key Features',
      regionLabel: 'Origin'
    },
    ar: {
      priceLabel: 'السعر للكيلو',
      sweetnessLabel: 'مستوى الحلاوة',
      textureLabel: 'الملمس',
      sizeLabel: 'الحجم',
      featuresLabel: 'الخصائص الرئيسية',
      regionLabel: 'المنطقة'
    }
  };

  const currentTexts = texts[language];

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-100">
        {dateType.image_url ? (
          <img
            src={dateType.image_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-amber-700" />
            </div>
          </div>
        )}
        
        {/* Premium badge */}
        {dateType.is_premium && (
          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {language === 'ar' ? 'مميز' : 'Premium'}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
              <span className="text-sm text-gray-600">{currentTexts.sweetnessLabel}:</span>
              <div className={`flex space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                {renderStars(dateType.sweetness_level)}
              </div>
            </div>
          </div>
          <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
            <div className={`flex items-center space-x-1 text-green-600 font-bold ${isRTL ? 'space-x-reverse' : ''}`}>
              <span>{dateType.average_price_per_kg}</span>
              <span className="text-sm">SAR</span>
            </div>
            <div className="text-xs text-gray-500">{currentTexts.priceLabel}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{description}</p>

        {/* Details */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-600">{currentTexts.textureLabel}:</span>
            <span className="font-medium text-gray-900">{texture}</span>
          </div>
          
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-600">{currentTexts.sizeLabel}:</span>
            <span className="font-medium text-gray-900">{size}</span>
          </div>

          {region && (
            <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{currentTexts.regionLabel}:</span>
              <span className="font-medium text-gray-900">{region}</span>
            </div>
          )}
        </div>

        {/* Taste profile */}
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800 italic">{taste}</p>
        </div>

        {/* Key features */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{currentTexts.featuresLabel}:</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{features}</p>
        </div>
      </div>
    </div>
  );
}
