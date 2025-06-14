
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Code, Settings, Shield, Database } from 'lucide-react';

const SystemDocs = () => {
  const docSections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      description: 'Basic setup and configuration guide',
      topics: ['Installation', 'Initial Setup', 'User Roles', 'Basic Configuration']
    },
    {
      title: 'API Documentation',
      icon: Code,
      description: 'Complete API reference and examples',
      topics: ['Authentication', 'Vehicles API', 'Bookings API', 'User Management API']
    },
    {
      title: 'System Configuration',
      icon: Settings,
      description: 'Advanced system settings and customization',
      topics: ['Environment Variables', 'Database Configuration', 'Email Settings', 'Payment Integration']
    },
    {
      title: 'Security & Permissions',
      icon: Shield,
      description: 'Security guidelines and permission management',
      topics: ['Role-Based Access', 'Data Protection', 'Security Best Practices', 'Audit Logs']
    },
    {
      title: 'Database Schema',
      icon: Database,
      description: 'Database structure and relationships',
      topics: ['Tables Overview', 'Relationships', 'Indexes', 'Migrations']
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Documentation</h1>
          <p className="text-gray-600">Comprehensive guides and technical documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.topics.map((topic, topicIndex) => (
                  <li key={topicIndex} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                    • {topic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>Essential commands and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Common Commands</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-100 p-2 rounded font-mono">npm run dev</div>
                <div className="bg-gray-100 p-2 rounded font-mono">npm run build</div>
                <div className="bg-gray-100 p-2 rounded font-mono">npm run test</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Environment Variables</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-100 p-2 rounded font-mono">VITE_SUPABASE_URL</div>
                <div className="bg-gray-100 p-2 rounded font-mono">VITE_SUPABASE_ANON_KEY</div>
                <div className="bg-gray-100 p-2 rounded font-mono">VITE_API_BASE_URL</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support & Help</CardTitle>
          <CardDescription>Get help and support resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold">User Manual</h4>
              <p className="text-sm text-gray-600">Complete user guide</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Code className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Developer Docs</h4>
              <p className="text-sm text-gray-600">Technical documentation</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Settings className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold">Admin Guide</h4>
              <p className="text-sm text-gray-600">Administration manual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDocs;
