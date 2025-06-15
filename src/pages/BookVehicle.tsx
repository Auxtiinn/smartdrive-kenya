import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, DollarSign } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

const BookVehicle = () => {
  const { vehicleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    returnLocation: '',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, user]);

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .eq('status', 'available')
        .single();

      if (error) throw error;
      setVehicle(data);
      setBookingData(prev => ({
        ...prev,
        pickupLocation: data.location || '',
        returnLocation: data.location || '',
      }));
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        title: "Error",
        description: "Vehicle not found or unavailable.",
        variant: "destructive",
      });
      navigate('/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = () => {
    if (!vehicle || !bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(1, days) * vehicle.daily_rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vehicle) return;

    setSubmitting(true);
    try {
      const totalCost = calculateTotalCost();
      
      if (totalCost <= 0) {
        throw new Error('Invalid booking dates');
      }

      // Create booking lock first
      const { error: lockError } = await supabase
        .from('booking_locks')
        .insert({
          vehicle_id: vehicle.id,
          customer_id: user.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
        });

      if (lockError) throw lockError;

      // Create the booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          vehicle_id: vehicle.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          pickup_location: bookingData.pickupLocation,
          return_location: bookingData.returnLocation,
          total_cost: totalCost,
          booking_notes: bookingData.notes,
        });

      if (bookingError) throw bookingError;

      toast({
        title: "Booking Created!",
        description: "Your booking has been successfully created.",
      });

      navigate('/bookings');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getFeatures = (features: Vehicle['features']): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features as string[];
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">The vehicle you're looking for is not available.</p>
          <Button onClick={() => navigate('/vehicles')}>Browse Vehicles</Button>
        </div>
      </div>
    );
  }

  const features = getFeatures(vehicle.features);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate('/vehicles')} className="mb-4">
          ← Back to Vehicles
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Book Your Vehicle</h1>
        <p className="text-gray-600">Complete your booking details below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            <CardDescription className="capitalize">
              {vehicle.type} • {vehicle.color}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Located at: {vehicle.location}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-xl font-bold">${vehicle.daily_rate}/day</span>
              </div>
              {features.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.startDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    required
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    value={bookingData.endDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  required
                  value={bookingData.pickupLocation}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, pickupLocation: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="returnLocation">Return Location</Label>
                <Input
                  id="returnLocation"
                  required
                  value={bookingData.returnLocation}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, returnLocation: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or notes..."
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                />
              </div>

              {bookingData.startDate && bookingData.endDate && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${calculateTotalCost().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !bookingData.startDate || !bookingData.endDate}
              >
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookVehicle;
