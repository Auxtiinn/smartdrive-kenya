
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleAdded?: () => void;
}

export const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }: AddVehicleModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'economy' as Database['public']['Enums']['vehicle_type'],
    license_plate: '',
    color: '',
    seats: 5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    mileage: 0,
    daily_rate: 0,
    location: '',
    features: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert({
          ...formData,
          agent_id: user.id,
          features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Vehicle added",
        description: "The vehicle has been added successfully.",
      });
      onVehicleAdded?.();
      onClose();
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'economy',
        license_plate: '',
        color: '',
        seats: 5,
        transmission: 'automatic',
        fuel_type: 'gasoline',
        mileage: 0,
        daily_rate: 0,
        location: '',
        features: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your assigned fleet
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                required
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                required
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Database['public']['Enums']['vehicle_type']})}
              >
                <option value="economy">Economy</option>
                <option value="compact">Compact</option>
                <option value="midsize">Midsize</option>
                <option value="fullsize">Fullsize</option>
                <option value="luxury">Luxury</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="license_plate">License Plate</Label>
              <Input
                id="license_plate"
                required
                value={formData.license_plate}
                onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                required
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="seats">Seats</Label>
              <Input
                id="seats"
                type="number"
                min="2"
                max="15"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <select
                id="transmission"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.transmission}
                onChange={(e) => setFormData({...formData, transmission: e.target.value})}
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <select
                id="fuel_type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.fuel_type}
                onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
              >
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="daily_rate">Daily Rate ($)</Label>
              <Input
                id="daily_rate"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.daily_rate}
                onChange={(e) => setFormData({...formData, daily_rate: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Downtown Branch"
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              placeholder="Air Conditioning, Bluetooth, GPS"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Vehicle'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
