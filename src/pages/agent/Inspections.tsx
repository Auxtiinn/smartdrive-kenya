
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Car, Calendar, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { InspectionModal } from '@/components/modals/InspectionModal';
import type { Database } from '@/integrations/supabase/types';

interface Inspection {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  condition_type: string;
  overall_condition: string;
  created_at: string;
}

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchInspections();
    }
  }, [user]);

  const fetchInspections = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('vehicle_conditions')
        .select(`
          id,
          vehicle_id,
          condition_type,
          overall_condition,
          created_at,
          vehicles!inner(make, model, year, license_plate)
        `)
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInspections = data?.map(item => ({
        id: item.id,
        vehicle_id: item.vehicle_id,
        vehicle_name: `${item.vehicles.year} ${item.vehicles.make} ${item.vehicles.model}`,
        condition_type: item.condition_type,
        overall_condition: item.overall_condition,
        created_at: item.created_at
      })) || [];

      setInspections(formattedInspections);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load inspections.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartInspection = () => {
    setShowInspectionModal(true);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const pendingCount = inspections.filter(i => 
    new Date(i.created_at).toDateString() === new Date().toDateString() && 
    i.overall_condition === 'pending'
  ).length;

  const completedTodayCount = inspections.filter(i => 
    new Date(i.created_at).toDateString() === new Date().toDateString()
  ).length;

  const issuesCount = inspections.filter(i => 
    i.overall_condition === 'poor' || i.overall_condition === 'damaged'
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Inspections</h1>
            <p className="text-gray-600">Conduct and manage vehicle condition assessments</p>
          </div>
        </div>
        <Button onClick={handleStartInspection}>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedTodayCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {issuesCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
          <CardDescription>
            All completed vehicle inspections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-100 text-green-800">
                      completed
                    </Badge>
                  </div>
                  <div>
                    <div className="font-semibold">{inspection.condition_type.replace('_', ' ')} Inspection</div>
                    <div className="text-sm text-gray-600">{inspection.vehicle_name}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {inspection.vehicle_id.slice(0, 8)}...
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(inspection.created_at).toLocaleDateString()}
                      </span>
                      <span className={`font-medium ${getConditionColor(inspection.overall_condition)}`}>
                        {inspection.overall_condition}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Report
                </Button>
              </div>
            ))}
          </div>
          
          {inspections.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Inspections Yet</h3>
              <p className="text-gray-600 mb-4">Start by conducting your first vehicle inspection.</p>
              <Button onClick={handleStartInspection}>
                <Plus className="mr-2 h-4 w-4" />
                Start First Inspection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <InspectionModal
        isOpen={showInspectionModal}
        onClose={() => {
          setShowInspectionModal(false);
          setSelectedVehicleId('');
        }}
        vehicleId={selectedVehicleId}
        vehicleName="Selected Vehicle"
        inspectionType="maintenance"
      />
    </div>
  );
};

export default Inspections;
