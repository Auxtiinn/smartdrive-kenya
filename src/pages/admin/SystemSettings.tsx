import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Mail, Database, Shield, Globe } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'SmartDrive',
    siteUrl: 'https://smartdrive.com',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
    maxBookingsPerUser: 5,
    defaultBookingDuration: 24,
    currency: 'USD',
    timezone: 'UTC',
    language: 'English'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // TODO: Implement save functionality
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure system-wide preferences and options</p>
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic application configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Site URL</label>
              <Input
                value={settings.siteUrl}
                onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                placeholder="Enter site URL"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Africa/Nairobi">East Africa Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-gray-500">Send notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">SMS Notifications</label>
                <p className="text-xs text-gray-500">Send notifications via SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Security and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Maintenance Mode</label>
                <p className="text-xs text-gray-500">Put site in maintenance mode</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle>System & Data</CardTitle>
            </div>
            <CardDescription>Data management and system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Backup</label>
                <p className="text-xs text-gray-500">Automatically backup data daily</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Bookings Per User</label>
              <Input
                type="number"
                value={settings.maxBookingsPerUser}
                onChange={(e) => handleSettingChange('maxBookingsPerUser', parseInt(e.target.value))}
                placeholder="5"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Booking Duration (hours)</label>
              <Input
                type="number"
                value={settings.defaultBookingDuration}
                onChange={(e) => handleSettingChange('defaultBookingDuration', parseInt(e.target.value))}
                placeholder="24"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system status and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-sm font-medium">Database</div>
              <div className="text-xs text-gray-500">Online</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-sm font-medium">API</div>
              <div className="text-xs text-gray-500">Healthy</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="text-sm font-medium">Storage</div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <div className="text-sm font-medium">Cache</div>
              <div className="text-xs text-gray-500">Rebuilding</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
