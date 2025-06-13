
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Shield, Users, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SmartDrive</h1>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Premium Car Rental
          <span className="text-blue-600 block">Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience seamless car rentals with our advanced management system. 
          Transparent pricing, real-time availability, and professional service.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/auth')}>
            Start Renting
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose SmartDrive?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Car className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Premium Fleet</CardTitle>
              <CardDescription>
                Modern vehicles from top brands, all maintained to the highest standards
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Transparent Pricing</CardTitle>
              <CardDescription>
                No hidden fees. See complete cost breakdown before booking
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Real-time Availability</CardTitle>
              <CardDescription>
                Live booking system prevents double bookings and ensures availability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* For Different Users */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>For Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Browse and book vehicles easily</li>
                  <li>• Transparent cost breakdown</li>
                  <li>• Real-time availability</li>
                  <li>• Digital condition reports</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Mobile-optimized interface</li>
                  <li>• Digital inspection tools</li>
                  <li>• Condition reporting system</li>
                  <li>• Maintenance scheduling</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Car className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>For Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Complete fleet management</li>
                  <li>• User role management</li>
                  <li>• Analytics and reporting</li>
                  <li>• System documentation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join SmartDrive today and experience the future of car rental
        </p>
        <Button size="lg" onClick={() => navigate('/auth')}>
          Create Your Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="h-6 w-6" />
            <span className="text-lg font-semibold">SmartDrive</span>
          </div>
          <p className="text-gray-400">© 2024 SmartDrive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
