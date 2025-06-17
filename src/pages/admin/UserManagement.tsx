
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Shield, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  email: string;
  role: string;
  active?: boolean; // Make optional since column might not exist yet
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Try to fetch with active column first, fallback if it doesn't exist
      let { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, active, created_at');

      if (error && error.message.includes('column "active" does not exist')) {
        // Fallback to query without active column
        const result = await supabase
          .from('profiles')
          .select('id, email, role, created_at');
        
        data = result.data;
        error = result.error;
        
        // Add default active status
        if (data) {
          data = data.map(user => ({ ...user, active: true }));
        }
      }

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!editingUser || !newRole) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });

      setShowRoleDialog(false);
      setEditingUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const toggleUserActivation = async (userId: string, userEmail: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${userEmail}?`)) return;

    try {
      // Try to update active status, fallback gracefully if column doesn't exist
      const updateData: any = {};
      
      try {
        updateData.active = !currentStatus;
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) {
          if (error.message.includes('column "active" does not exist')) {
            toast({
              title: "Feature Not Available",
              description: "User activation/deactivation feature is not yet fully configured. Please contact system administrator.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        toast({
          title: "Success",
          description: `User has been ${action}d successfully.`,
        });

        fetchUsers();
      } catch (err: any) {
        throw err;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} user.`,
        variant: "destructive",
      });
    }
  };

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'agent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusColor = (active: boolean | undefined) => {
    const isActive = active !== false; // Default to true if undefined
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage system users and their roles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Role</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Created</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 text-gray-900 dark:text-white">{user.email}</td>
                    <td className="p-3">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(user.active)}>
                        {user.active !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRole(user)}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          Edit Role
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserActivation(user.id, user.email, user.active !== false)}
                        >
                          {user.active !== false ? (
                            <>
                              <UserX className="mr-1 h-3 w-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-1 h-3 w-3" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Select new role</Label>
              <select
                id="role"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateUserRole} className="flex-1">
                Update Role
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowRoleDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
