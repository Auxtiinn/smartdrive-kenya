
import { useAuth } from '@/hooks/useAuth';
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
  Home
} from 'lucide-react';

export const Sidebar = () => {
  const { user, userRole, signOut } = useAuth();
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
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartDrive</h1>
            <p className="text-sm text-gray-500 capitalize">{userRole} Portal</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          <p className="text-xs text-gray-500 capitalize">{userRole}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
