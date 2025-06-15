import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Car,
  Calendar,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Wrench,
  FileText,
  Shield,
  Home,
  User,
  Moon,
  Sun
} from 'lucide-react';

export const Sidebar = () => {
  const { user, userRole, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const customerMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Car, label: 'Browse Vehicles', path: '/vehicles' },
    { icon: Calendar, label: 'My Bookings', path: '/bookings' },
    { icon: Settings, label: 'Profile', path: '/profile' },
  ];

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
    { icon: Calendar, label: 'All Bookings', path: '/admin/bookings' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Wrench, label: 'Maintenance', path: '/admin/maintenance' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'System Docs', path: '/admin/docs' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const agentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Car, label: 'My Vehicles', path: '/agent/vehicles' },
    { icon: Shield, label: 'Inspections', path: '/agent/inspections' },
    { icon: Wrench, label: 'Maintenance', path: '/agent/maintenance' },
    { icon: Settings, label: 'Profile', path: '/profile' },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return adminMenuItems;
      case 'agent':
        return agentMenuItems;
      default:
        return customerMenuItems;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartDrive</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userRole} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-600 text-white"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">{userRole}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
