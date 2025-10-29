import { Shield, LogIn } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';

export default function AdminLogin() {
  const { redirectToLogin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى إعدادات إدارة التمور</p>
        </div>

        <button
          onClick={redirectToLogin}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 space-x-reverse"
        >
          <LogIn className="w-5 h-5" />
          <span>تسجيل الدخول بواسطة Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            هذه اللوحة مخصصة للإداريين فقط
          </p>
        </div>
      </div>
    </div>
  );
}
