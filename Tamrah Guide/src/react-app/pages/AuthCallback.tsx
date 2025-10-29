import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { exchangeCodeForSessionToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate('/admin');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="animate-spin mb-4 mx-auto">
          <Loader2 className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">جاري تسجيل الدخول...</h2>
        <p className="text-gray-600">يرجى الانتظار بينما نقوم بتأكيد هويتك</p>
      </div>
    </div>
  );
}
