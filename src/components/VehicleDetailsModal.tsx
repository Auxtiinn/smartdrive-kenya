
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Car, Calendar, MapPin, Settings, Fuel, Users } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export const VehicleDetailsModal = ({ isOpen, onClose, vehicle }: VehicleDetailsModalProps) => {
  if (!vehicle) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rented': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'out_of_service': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            {vehicle.year} {vehicle.make} {vehicle.model}
          </DialogTitle>
          <DialogDescription>
            Complete vehicle information and specifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Vehicle ID</label>
              <p className="text-sm font-mono bg-muted p-2 rounded">{vehicle.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">License Plate</p>
                  <p className="text-sm text-muted-foreground">{vehicle.license_plate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{vehicle.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Seats</p>
                  <p className="text-sm text-muted-foreground">{vehicle.seats} passengers</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fuel Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{vehicle.fuel_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Transmission</p>
                  <p className="text-sm text-muted-foreground capitalize">{vehicle.transmission}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium">Color</p>
              <p className="text-sm text-muted-foreground capitalize">{vehicle.color}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Mileage</p>
              <p className="text-sm text-muted-foreground">{vehicle.mileage?.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-sm font-medium">Daily Rate</p>
              <p className="text-sm font-bold text-green-600">${vehicle.daily_rate}</p>
            </div>
          </div>

          {/* Features */}
          {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature as string}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t text-xs text-muted-foreground">
            <div>
              <p>Created: {new Date(vehicle.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p>Updated: {new Date(vehicle.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
