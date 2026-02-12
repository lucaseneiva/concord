import { useAuthStore } from '../store/authStore.js';
import { Button } from '../components/ui/Button.jsx';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Concord Dashboard</h1>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome back, {user?.username}!
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{user?.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="ml-2 text-gray-600">{user?.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Member since:</span>
                <span className="ml-2 text-gray-600">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Create your first server</li>
                <li>Invite friends to join</li>
                <li>Set up channels</li>
                <li>Start chatting!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};