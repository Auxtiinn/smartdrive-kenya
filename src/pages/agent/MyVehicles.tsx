
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Calendar, Fuel, Settings } from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  location: string;
  mileage: number;
  fuel_level: number;
  last_inspection: string;
}

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assigned vehicles
    setTimeout(() => {
      setVehicles([
        {
          id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          license_plate: 'ABC123',
          status: 'available',
          location: 'Nairobi Central',
          mileage: 15420,
          fuel_level: 85,
          last_inspection: '2024-01-10'
        },
        {
          id: '2',
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          license_plate: 'DEF456',
          status: 'rented',
          location: 'Westlands',
          mileage: 22100,
          fuel_level: 60,
          last_inspection: '2024-01-08'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assigned Vehicles</h1>
            <p className="text-gray-600">Manage and monitor your assigned vehicles</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </CardTitle>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
              <CardDescription className="font-mono text-sm">
                {vehicle.license_plate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Settings className="h-4 w-4" />
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Fuel className="h-4 w-4" />
                  <span>{vehicle.fuel_level}% fuel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Last inspected: {new Date(vehicle.last_inspection).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button className="w-full" size="sm">
                  Perform Inspection
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Vehicles Assigned</h3>
          <p className="text-gray-600">You haven't been assigned any vehicles yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
