import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [fleetStats, setFleetStats] = useState({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
    outOfService: 0
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch vehicle statistics
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('status');

      if (vehiclesError) throw vehiclesError;

      const stats = vehicles?.reduce((acc, vehicle) => {
        acc.total++;
        switch (vehicle.status) {
          case 'available':
            acc.available++;
            break;
          case 'rented':
            acc.rented++;
            break;
          case 'maintenance':
            acc.maintenance++;
            break;
          case 'out_of_service':
            acc.outOfService++;
            break;
        }
        return acc;
      }, { total: 0, available: 0, rented: 0, maintenance: 0, outOfService: 0 }) || { total: 0, available: 0, rented: 0, maintenance: 0, outOfService: 0 };

      setFleetStats(stats);

      // Fetch user count
      const { count: userCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;
      setTotalUsers(userCount || 0);

      // Fetch active bookings
      const { count: bookingCount, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('status', ['active', 'confirmed']);

      if (bookingsError) throw bookingsError;
      setActiveBookings(bookingCount || 0);

      // Calculate revenue (this month)
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: completedBookings, error: revenueError } = await supabase
        .from('bookings')
        .select('total_cost')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth);

      if (revenueError) throw revenueError;

      const totalRevenue = completedBookings?.reduce((sum, booking) => sum + (Number(booking.total_cost) || 0), 0) || 0;
      setRevenue(totalRevenue);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Monitor and manage your car rental business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {fleetStats.available} available, {fleetStats.rented} rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground">Confirmed and active rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current status of your vehicle fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Available Vehicles</span>
                <span className="text-sm font-medium text-green-600">{fleetStats.available}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Currently Rented</span>
                <span className="text-sm font-medium text-blue-600">{fleetStats.rented}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Under Maintenance</span>
                <span className="text-sm font-medium text-orange-600">{fleetStats.maintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Out of Service</span>
                <span className="text-sm font-medium text-red-600">{fleetStats.outOfService}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">System is running smoothly</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
