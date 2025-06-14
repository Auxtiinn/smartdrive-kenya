
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Car, Calendar, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

interface Inspection {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  inspection_type: string;
  status: string;
  scheduled_date: string;
  completed_date?: string;
  overall_condition: string;
  issues_found: number;
}

const Inspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading inspections
    setTimeout(() => {
      setInspections([
        {
          id: '1',
          vehicle_id: 'ABC123',
          vehicle_name: '2022 Toyota Camry',
          inspection_type: 'Pre-rental',
          status: 'completed',
          scheduled_date: '2024-01-15',
          completed_date: '2024-01-15',
          overall_condition: 'good',
          issues_found: 0
        },
        {
          id: '2',
          vehicle_id: 'DEF456',
          vehicle_name: '2021 Honda Civic',
          inspection_type: 'Post-rental',
          status: 'pending',
          scheduled_date: '2024-01-16',
          overall_condition: 'pending',
          issues_found: 0
        },
        {
          id: '3',
          vehicle_id: 'GHI789',
          vehicle_name: '2023 Nissan Altima',
          inspection_type: 'Routine',
          status: 'completed',
          scheduled_date: '2024-01-14',
          completed_date: '2024-01-14',
          overall_condition: 'fair',
          issues_found: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <Button>
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
              {inspections.filter(i => i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {inspections.filter(i => i.status === 'completed' && 
                new Date(i.completed_date || '').toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {inspections.reduce((total, i) => total + i.issues_found, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections</CardTitle>
          <CardDescription>
            All scheduled and completed vehicle inspections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {inspection.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Shield className="h-5 w-5 text-yellow-600" />
                    )}
                    <Badge className={getStatusColor(inspection.status)}>
                      {inspection.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-semibold">{inspection.inspection_type} Inspection</div>
                    <div className="text-sm text-gray-600">{inspection.vehicle_name}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {inspection.vehicle_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(inspection.scheduled_date).toLocaleDateString()}
                      </span>
                      {inspection.overall_condition !== 'pending' && (
                        <span className={`font-medium ${getConditionColor(inspection.overall_condition)}`}>
                          {inspection.overall_condition}
                        </span>
                      )}
                      {inspection.issues_found > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {inspection.issues_found} issues
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {inspection.status === 'pending' ? 'Start Inspection' : 'View Report'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inspections;
