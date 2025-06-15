
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName: string;
  inspectionType: 'pre_rental' | 'post_rental' | 'maintenance' | 'damage_report';
}

export const InspectionModal = ({ isOpen, onClose, vehicleId, vehicleName, inspectionType }: InspectionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    overall_condition: 'good' as const,
    exterior_condition: 'good' as const,
    interior_condition: 'good' as const,
    mechanical_condition: 'good' as const,
    fuel_level: 100,
    mileage: 0,
    notes: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vehicle_conditions')
        .insert({
          vehicle_id: vehicleId,
          reporter_id: user.id,
          condition_type: inspectionType,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Inspection completed",
        description: "Vehicle inspection has been recorded successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save inspection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vehicle Inspection</DialogTitle>
          <DialogDescription>
            Perform {inspectionType.replace('_', ' ')} inspection for {vehicleName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overall_condition">Overall Condition</Label>
              <select
                id="overall_condition"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.overall_condition}
                onChange={(e) => setFormData({...formData, overall_condition: e.target.value as any})}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <Label htmlFor="exterior_condition">Exterior Condition</Label>
              <select
                id="exterior_condition"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.exterior_condition}
                onChange={(e) => setFormData({...formData, exterior_condition: e.target.value as any})}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interior_condition">Interior Condition</Label>
              <select
                id="interior_condition"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.interior_condition}
                onChange={(e) => setFormData({...formData, interior_condition: e.target.value as any})}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <Label htmlFor="mechanical_condition">Mechanical Condition</Label>
              <select
                id="mechanical_condition"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.mechanical_condition}
                onChange={(e) => setFormData({...formData, mechanical_condition: e.target.value as any})}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel_level">Fuel Level (%)</Label>
              <Input
                id="fuel_level"
                type="number"
                min="0"
                max="100"
                value={formData.fuel_level}
                onChange={(e) => setFormData({...formData, fuel_level: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or issues..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Complete Inspection'}
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
