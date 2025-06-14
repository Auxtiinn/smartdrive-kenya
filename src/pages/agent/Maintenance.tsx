
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Car, Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  task_type: string;
  priority: string;
  status: string;
  scheduled_date: string;
  due_date: string;
  description: string;
  estimated_duration: string;
}

const AgentMaintenance = () => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading maintenance tasks assigned to this agent
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          vehicle_id: 'ABC123',
          vehicle_name: '2022 Toyota Camry',
          task_type: 'Oil Change',
          priority: 'medium',
          status: 'assigned',
          scheduled_date: '2024-01-16',
          due_date: '2024-01-18',
          description: 'Routine oil change and filter replacement',
          estimated_duration: '1 hour'
        },
        {
          id: '2',
          vehicle_id: 'DEF456',
          vehicle_name: '2021 Honda Civic',
          task_type: 'Brake Inspection',
          priority: 'high',
          status: 'in_progress',
          scheduled_date: '2024-01-15',
          due_date: '2024-01-16',
          description: 'Check brake pads, rotors, and brake fluid',
          estimated_duration: '2 hours'
        },
        {
          id: '3',
          vehicle_id: 'GHI789',
          vehicle_name: '2023 Nissan Altima',
          task_type: 'Tire Rotation',
          priority: 'low',
          status: 'completed',
          scheduled_date: '2024-01-14',
          due_date: '2024-01-15',
          description: 'Rotate tires and check tire pressure',
          estimated_duration: '45 minutes'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'assigned': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Tasks</h1>
            <p className="text-gray-600">Manage your assigned maintenance activities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'assigned').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {tasks.filter(t => new Date(t.due_date).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
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
            Your assigned maintenance tasks and their current status
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
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-semibold">{task.task_type}</div>
                    <div className="text-sm text-gray-600">{task.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {task.vehicle_name} ({task.vehicle_id})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimated_duration}
                      </span>
                      <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'assigned' && (
                    <Button size="sm">Start Task</Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button size="sm" variant="outline">Complete Task</Button>
                  )}
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Tasks</h3>
          <p className="text-gray-600">You have no maintenance tasks assigned at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default AgentMaintenance;
