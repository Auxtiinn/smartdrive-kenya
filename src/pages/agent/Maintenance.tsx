import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Calendar, DollarSign, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MaintenanceTaskModal } from '@/components/modals/MaintenanceTaskModal';
import type { Database } from '@/integrations/supabase/types';

type MaintenanceLog = Database['public']['Tables']['maintenance_logs']['Row'];

const Maintenance = () => {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMaintenanceLogs();
    }
  }, [user]);

  const fetchMaintenanceLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('performed_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaintenanceLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load maintenance logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const updates: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'completed') {
        updates.completed_date = new Date().toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('maintenance_logs')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: `Task marked as ${newStatus}.`,
      });
      
      fetchMaintenanceLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return AlertCircle;
      case 'scheduled': return Clock;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const scheduledCount = maintenanceLogs.filter(log => log.status === 'scheduled').length;
  const inProgressCount = maintenanceLogs.filter(log => log.status === 'in_progress').length;
  const completedThisMonth = maintenanceLogs.filter(log => 
    log.status === 'completed' && 
    new Date(log.updated_at).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Tasks</h1>
            <p className="text-gray-600">Manage vehicle maintenance and repairs</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {scheduledCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {inProgressCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedThisMonth}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Tasks</CardTitle>
          <CardDescription>
            All maintenance tasks assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceLogs.map((log) => {
              const StatusIcon = getStatusIcon(log.status);
              return (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-5 w-5" />
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-semibold">{log.maintenance_type}</div>
                      <div className="text-sm text-gray-600">{log.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {log.scheduled_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.scheduled_date).toLocaleDateString()}
                          </span>
                        )}
                        {log.cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${log.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {log.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(log.id, 'in_progress')}
                      >
                        Start Task
                      </Button>
                    )}
                    {log.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(log.id, 'completed')}
                      >
                        Complete Task
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {maintenanceLogs.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Tasks</h3>
              <p className="text-gray-600 mb-4">You don't have any maintenance tasks assigned yet.</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MaintenanceTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskAdded={fetchMaintenanceLogs}
      />
    </div>
  );
};

export default Maintenance;
