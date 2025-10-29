import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, X } from 'lucide-react';
import { DateType } from '@/shared/types';

interface AdminDateManagerProps {
  dateTypes: DateType[];
}

interface DateFormData {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  taste_profile_en: string;
  taste_profile_ar: string;
  sweetness_level: number;
  texture_en: string;
  texture_ar: string;
  color: string;
  size_en: string;
  size_ar: string;
  average_price_per_kg: number;
  key_features_en: string;
  key_features_ar: string;
  image_url: string | null;
  is_premium: boolean;
  harvest_season_en: string | null;
  harvest_season_ar: string | null;
  origin_region_en: string | null;
  origin_region_ar: string | null;
}

const initialFormData: DateFormData = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  taste_profile_en: '',
  taste_profile_ar: '',
  sweetness_level: 1,
  texture_en: '',
  texture_ar: '',
  color: '',
  size_en: '',
  size_ar: '',
  average_price_per_kg: 0,
  key_features_en: '',
  key_features_ar: '',
  image_url: null,
  is_premium: false,
  harvest_season_en: null,
  harvest_season_ar: null,
  origin_region_en: null,
  origin_region_ar: null,
};

export default function AdminDateManager({ dateTypes }: AdminDateManagerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<DateFormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = (dateType: DateType) => {
    setEditingId(dateType.id);
    setFormData({
      name_en: dateType.name_en,
      name_ar: dateType.name_ar,
      description_en: dateType.description_en,
      description_ar: dateType.description_ar,
      taste_profile_en: dateType.taste_profile_en,
      taste_profile_ar: dateType.taste_profile_ar,
      sweetness_level: dateType.sweetness_level,
      texture_en: dateType.texture_en,
      texture_ar: dateType.texture_ar,
      color: dateType.color,
      size_en: dateType.size_en,
      size_ar: dateType.size_ar,
      average_price_per_kg: dateType.average_price_per_kg,
      key_features_en: dateType.key_features_en,
      key_features_ar: dateType.key_features_ar,
      image_url: dateType.image_url,
      is_premium: dateType.is_premium,
      harvest_season_en: dateType.harvest_season_en,
      harvest_season_ar: dateType.harvest_season_ar,
      origin_region_en: dateType.origin_region_en,
      origin_region_ar: dateType.origin_region_ar,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(initialFormData);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', 'dates');

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('فشل في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingId 
        ? `/api/admin/date-types/${editingId}`
        : '/api/admin/date-types';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Save failed');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error saving date type:', error);
      alert('فشل في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا النوع؟')) return;

    try {
      const response = await fetch(`/api/admin/date-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      window.location.reload();
    } catch (error) {
      console.error('Error deleting date type:', error);
      alert('فشل في حذف النوع');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة أنواع التمور</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة نوع جديد</span>
        </button>
      </div>

      {/* Create New Form */}
      {isCreating && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
          <DateForm
            formData={formData}
            setFormData={setFormData}
            onImageUpload={handleImageUpload}
            uploading={uploading}
            saving={saving}
            onSave={handleSave}
            onCancel={handleCancel}
            title="إضافة نوع تمر جديد"
          />
        </div>
      )}

      {/* Date Types List */}
      <div className="grid gap-6">
        {dateTypes.map((dateType) => (
          <div key={dateType.id} className="bg-white rounded-2xl shadow-lg border border-amber-200">
            {editingId === dateType.id ? (
              <div className="p-6">
                <DateForm
                  formData={formData}
                  setFormData={setFormData}
                  onImageUpload={handleImageUpload}
                  uploading={uploading}
                  saving={saving}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  title="تعديل نوع التمر"
                />
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {dateType.name_ar} / {dateType.name_en}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">الوصف العربي:</p>
                        <p className="text-gray-900">{dateType.description_ar}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">الوصف الإنجليزي:</p>
                        <p className="text-gray-900">{dateType.description_en}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">السعر:</p>
                        <p className="text-gray-900">{dateType.average_price_per_kg}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">مستوى الحلاوة:</p>
                        <p className="text-gray-900">{dateType.sweetness_level}/5</p>
                      </div>
                    </div>
                  </div>
                  
                  {dateType.image_url && (
                    <div className="ml-4 w-24 h-24 rounded-lg overflow-hidden bg-amber-100">
                      <img
                        src={dateType.image_url}
                        alt={dateType.name_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={() => handleEdit(dateType)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDelete(dateType.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DateFormProps {
  formData: DateFormData;
  setFormData: (data: DateFormData) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}

function DateForm({ 
  formData, 
  setFormData, 
  onImageUpload, 
  uploading, 
  saving, 
  onSave, 
  onCancel, 
  title 
}: DateFormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Names */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم العربي</label>
          <input
            type="text"
            value={formData.name_ar}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-right"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الإنجليزي</label>
          <input
            type="text"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف العربي</label>
          <textarea
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-right"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف الإنجليزي</label>
          <textarea
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Price and Sweetness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">السعر للكيلو</label>
          <input
            type="number"
            value={formData.average_price_per_kg}
            onChange={(e) => setFormData({ ...formData, average_price_per_kg: Number(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">مستوى الحلاوة (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={formData.sweetness_level}
            onChange={(e) => setFormData({ ...formData, sweetness_level: Number(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Other fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الملمس العربي</label>
          <input
            type="text"
            value={formData.texture_ar}
            onChange={(e) => setFormData({ ...formData, texture_ar: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-right"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الملمس الإنجليزي</label>
          <input
            type="text"
            value={formData.texture_en}
            onChange={(e) => setFormData({ ...formData, texture_en: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اللون</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_premium}
            onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
            className="ml-2 h-4 w-4 text-amber-600 focus:ring-amber-500"
          />
          <label className="text-sm font-medium text-gray-700">نوع مميز</label>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">صورة التمر</label>
        <div className="flex items-center space-x-4 space-x-reverse">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-2 space-x-reverse ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'جاري الرفع...' : 'رفع صورة'}</span>
          </label>
          {formData.image_url && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-amber-100">
              <img
                src={formData.image_url}
                alt="صورة التمر"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 space-x-reverse mt-6">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 flex items-center space-x-2 space-x-reverse"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'جاري الحفظ...' : 'حفظ'}</span>
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <X className="w-4 h-4" />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
}
