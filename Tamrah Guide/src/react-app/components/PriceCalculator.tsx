import { useState } from 'react';
import { Calculator, Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { DateType } from '@/shared/types';

interface PriceCalculatorProps {
  dateTypes: DateType[];
}

export default function PriceCalculator({ dateTypes }: PriceCalculatorProps) {
  const { language, isRTL } = useLanguage();
  const [selectedDateType, setSelectedDateType] = useState<number>(dateTypes[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);

  const texts = {
    en: {
      title: 'Price Calculator',
      subtitle: 'Calculate the total cost for your date purchase',
      selectDate: 'Select Date Type',
      quantity: 'Quantity (kg)',
      pricePerKg: 'Price per kg',
      totalCost: 'Total Cost'
    },
    ar: {
      title: 'حاسبة الأسعار',
      subtitle: 'احسب التكلفة الإجمالية لشراء التمور',
      selectDate: 'اختر نوع التمر',
      quantity: 'الكمية (كيلو)',
      pricePerKg: 'السعر للكيلو',
      totalCost: 'التكلفة الإجمالية'
    }
  };

  const currentTexts = texts[language];
  const selectedDate = dateTypes.find(dt => dt.id === selectedDateType);
  const totalCost = selectedDate ? selectedDate.average_price_per_kg * quantity : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0.1, quantity + delta);
    setQuantity(Math.round(newQuantity * 10) / 10);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
      {/* Header */}
      <div className={`flex items-center space-x-3 mb-6 ${isRTL ? 'space-x-reverse' : ''}`}>
        <div className="bg-green-100 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{currentTexts.title}</h2>
          <p className="text-gray-600 text-sm">{currentTexts.subtitle}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Date Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentTexts.selectDate}
          </label>
          <select
            value={selectedDateType}
            onChange={(e) => setSelectedDateType(Number(e.target.value))}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
              isRTL ? 'text-right' : ''
            }`}
          >
            {dateTypes.map((dateType) => (
              <option key={dateType.id} value={dateType.id}>
                {language === 'ar' ? dateType.name_ar : dateType.name_en} - {dateType.average_price_per_kg} SAR
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentTexts.quantity}
          </label>
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => handleQuantityChange(-0.5)}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
              step="0.1"
              min="0.1"
              className={`flex-1 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                isRTL ? 'text-right' : ''
              }`}
            />
            <button
              onClick={() => handleQuantityChange(0.5)}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        {selectedDate && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
            <div className="space-y-3">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-700">{currentTexts.pricePerKg}:</span>
                <span className="font-medium">
                  {selectedDate.average_price_per_kg} SAR
                </span>
              </div>
              
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-700">{currentTexts.quantity}:</span>
                <span className="font-medium">{quantity} kg</span>
              </div>
              
              <div className={`border-t border-amber-300 pt-3 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg font-bold text-gray-900">{currentTexts.totalCost}:</span>
                <span className="text-2xl font-bold text-green-600">
                  {totalCost.toFixed(2)} SAR
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
