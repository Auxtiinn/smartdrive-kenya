import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];

const FleetManagement = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
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
    status: 'available' as Database['public']['Enums']['vehicle_status'],
    location: '',
    features: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const vehicleData: VehicleInsert = {
        make: vehicleForm.make,
        model: vehicleForm.model,
        year: vehicleForm.year,
        type: vehicleForm.type,
        license_plate: vehicleForm.license_plate,
        color: vehicleForm.color,
        seats: vehicleForm.seats,
        transmission: vehicleForm.transmission,
        fuel_type: vehicleForm.fuel_type,
        mileage: vehicleForm.mileage,
        daily_rate: vehicleForm.daily_rate,
        status: vehicleForm.status,
        location: vehicleForm.location,
        features: vehicleForm.features ? vehicleForm.features.split(',').map(f => f.trim()) : [],
      };

      if (editingVehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle.id);

        if (error) throw error;
        toast({ title: "Success", description: "Vehicle updated successfully." });
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert(vehicleData);

        if (error) throw error;
        toast({ title: "Success", description: "Vehicle added successfully." });
      }

      setDialogOpen(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    const features = Array.isArray(vehicle.features) ? (vehicle.features as string[]).join(', ') : '';
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      license_plate: vehicle.license_plate,
      color: vehicle.color,
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type,
      mileage: vehicle.mileage || 0,
      daily_rate: Number(vehicle.daily_rate),
      status: vehicle.status,
      location: vehicle.location || '',
      features,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;
      toast({ title: "Success", description: "Vehicle deleted successfully." });
      fetchVehicles();
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setVehicleForm({
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
      status: 'available',
      location: '',
      features: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">Manage your vehicle inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingVehicle(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </DialogTitle>
              <DialogDescription>
                {editingVehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    required
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
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
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value as Database['public']['Enums']['vehicle_type'] })}
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
                    value={vehicleForm.license_plate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, license_plate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    required
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
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
                    value={vehicleForm.seats}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, seats: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <select
                    id="transmission"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={vehicleForm.transmission}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
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
                    value={vehicleForm.fuel_type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuel_type: e.target.value })}
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
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: parseInt(e.target.value) })}
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
                    value={vehicleForm.daily_rate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, daily_rate: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as Database['public']['Enums']['vehicle_status'] })}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={vehicleForm.location}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  placeholder="Air Conditioning, Bluetooth, GPS"
                  value={vehicleForm.features}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, features: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const features = getFeatures(vehicle.features);
          return (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>
                  {vehicle.license_plate} • {vehicle.color} {vehicle.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Daily Rate:</strong> ${vehicle.daily_rate}</p>
                  <p><strong>Location:</strong> {vehicle.location}</p>
                  <p><strong>Mileage:</strong> {vehicle.mileage?.toLocaleString()} miles</p>
                  <p><strong>Seats:</strong> {vehicle.seats} • <strong>Transmission:</strong> {vehicle.transmission}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles in fleet</h3>
          <p className="text-gray-600">Add your first vehicle to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
