import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertTriangle, Calendar, Car, Plus } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  vehicle_id: string;
  task_type: string;
  status: string;
  scheduled_date: string;
  completed_date?: string;
  description: string;
  cost?: number;
}

const Maintenance = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading maintenance tasks
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          vehicle_id: 'ABC123',
          task_type: 'Oil Change',
          status: 'pending',
          scheduled_date: '2024-01-15',
          description: 'Routine oil change and filter replacement',
          cost: 85
        },
        {
          id: '2',
          vehicle_id: 'DEF456',
          task_type: 'Tire Rotation',
          status: 'completed',
          scheduled_date: '2024-01-10',
          completed_date: '2024-01-10',
          description: 'Rotate tires and check pressure',
          cost: 45
        },
        {
          id: '3',
          vehicle_id: 'GHI789',
          task_type: 'Brake Inspection',
          status: 'overdue',
          scheduled_date: '2024-01-05',
          description: 'Inspect brake pads and rotors',
          cost: 120
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
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
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
            <p className="text-gray-600">Track and schedule vehicle maintenance</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {tasks.filter(t => t.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Tasks</CardTitle>
          <CardDescription>
            All scheduled and completed maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-semibold">{task.task_type}</div>
                    <div className="text-sm text-gray-600">{task.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {task.vehicle_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.scheduled_date).toLocaleDateString()}
                      </span>
                      {task.cost && (
                        <span>${task.cost}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
