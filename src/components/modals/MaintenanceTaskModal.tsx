
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MaintenanceTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId?: string;
  onTaskAdded?: () => void;
}

export const MaintenanceTaskModal = ({ isOpen, onClose, vehicleId, onTaskAdded }: MaintenanceTaskModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: vehicleId || '',
    maintenance_type: '',
    description: '',
    cost: '',
    scheduled_date: '',
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
        .from('maintenance_logs')
        .insert({
          vehicle_id: formData.vehicle_id,
          performed_by: user.id,
          maintenance_type: formData.maintenance_type,
          description: formData.description,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          scheduled_date: formData.scheduled_date || null,
          notes: formData.notes,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Maintenance task added",
        description: "The maintenance task has been scheduled successfully.",
      });
      onTaskAdded?.();
      onClose();
      setFormData({
        vehicle_id: vehicleId || '',
        maintenance_type: '',
        description: '',
        cost: '',
        scheduled_date: '',
        notes: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add maintenance task.",
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
          <DialogTitle>Add Maintenance Task</DialogTitle>
          <DialogDescription>
            Schedule a new maintenance task for a vehicle
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicle_id">Vehicle ID</Label>
            <Input
              id="vehicle_id"
              required
              value={formData.vehicle_id}
              onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
              placeholder="Enter vehicle ID"
            />
          </div>

          <div>
            <Label htmlFor="maintenance_type">Maintenance Type</Label>
            <select
              id="maintenance_type"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.maintenance_type}
              onChange={(e) => setFormData({...formData, maintenance_type: e.target.value})}
            >
              <option value="">Select type</option>
              <option value="Oil Change">Oil Change</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Tire Rotation">Tire Rotation</option>
              <option value="Engine Check">Engine Check</option>
              <option value="Transmission Service">Transmission Service</option>
              <option value="Battery Check">Battery Check</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              placeholder="Describe the maintenance work needed..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Estimated Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Task'}
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
