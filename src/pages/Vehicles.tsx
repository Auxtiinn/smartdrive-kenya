import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Car, Users, Fuel, Settings, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

const Vehicles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available');

      if (filters.type) {
        query = query.eq('type', filters.type as Database['public']['Enums']['vehicle_type']);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.maxPrice) {
        query = query.lte('daily_rate', parseFloat(filters.maxPrice));
      }

      const { data, error } = await query.order('daily_rate');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookVehicle = (vehicleId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a vehicle.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    navigate(`/book/${vehicleId}`);
  };

  const vehicleTypes = ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'truck', 'van'];

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

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Vehicles</h1>
        <p className="text-gray-600">Find the perfect vehicle for your needs</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Vehicle Type</Label>
              <select
                id="type"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Daily Rate ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Enter max price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const features = getFeatures(vehicle.features);
          return (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
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
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {vehicle.seats} seats
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      {vehicle.transmission}
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      {vehicle.fuel_type}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {vehicle.location}
                  </div>

                  {features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${vehicle.daily_rate}
                        </p>
                        <p className="text-sm text-gray-600">per day</p>
                      </div>
                      <Button
                        onClick={() => handleBookVehicle(vehicle.id)}
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more options.</p>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
