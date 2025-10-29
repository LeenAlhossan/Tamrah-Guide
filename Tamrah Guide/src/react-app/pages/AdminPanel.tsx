import { useAuth } from '@getmocha/users-service/react';
import { useDateTypes } from '@/react-app/hooks/useDateTypes';
import AdminLogin from '@/react-app/components/AdminLogin';
import AdminDateManager from '@/react-app/components/AdminDateManager';
import { Loader2, Shield, LogOut } from 'lucide-react';

export default function AdminPanel() {
  const { user, isPending, logout } = useAuth();
  const { dateTypes, loading } = useDateTypes();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="w-12 h-12 text-amber-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
                <p className="text-sm text-gray-600">إدارة أنواع التمور والصور</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-sm text-gray-700">
                أهلاً، {user.google_user_data.given_name || user.email}
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 space-x-reverse bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Loader2 className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        ) : (
          <AdminDateManager dateTypes={dateTypes} />
        )}
      </main>
    </div>
  );
}
