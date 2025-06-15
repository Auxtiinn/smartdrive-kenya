import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Car, MapPin, DollarSign, Clock } from 'lucide-react';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  return_location: string;
  total_cost: number;
  status: string;
  booking_notes: string;
  created_at: string;
  vehicles: {
    make: string;
    model: string;
    year: number;
    type: string;
    color: string;
  };
}

const Bookings = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          vehicles (
            make,
            model,
            year,
            type,
            color
          )
        `)
        .order('created_at', { ascending: false });

      // If not admin/agent, only show user's bookings
      if (userRole === 'customer') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });

      // Refresh the bookings list to reflect the cancellation
      await fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {userRole === 'customer' ? 'My Bookings' : 'All Bookings'}
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'customer' 
            ? 'View and manage your vehicle bookings' 
            : 'Manage all customer bookings'
          }
        </p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  {booking.vehicles.year} {booking.vehicles.make} {booking.vehicles.model}
                </CardTitle>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="capitalize">
                {booking.vehicles.type} • {booking.vehicles.color}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-sm">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Pickup</p>
                    <p className="text-sm">{booking.pickup_location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Return</p>
                    <p className="text-sm">{booking.return_location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Total Cost</p>
                    <p className="text-sm font-bold text-green-600">
                      ${booking.total_cost}
                    </p>
                  </div>
                </div>
              </div>

              {booking.booking_notes && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{booking.booking_notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  Booked on {new Date(booking.created_at).toLocaleDateString()}
                </div>

                {booking.status === 'pending' && userRole === 'customer' && (
                  <Button
                    variant="outline"
                    onClick={() => cancelBooking(booking.id)}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground">
            {userRole === 'customer' 
              ? "You haven't made any bookings yet." 
              : "No customer bookings to display."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookings;
