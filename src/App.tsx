
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import FleetManagement from "./pages/admin/FleetManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/vehicles" element={<Layout><Vehicles /></Layout>} />
            <Route path="/book/:vehicleId" element={<Layout><BookVehicle /></Layout>} />
            <Route path="/bookings" element={<Layout><Bookings /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/fleet" element={<Layout><FleetManagement /></Layout>} />
            <Route path="/admin/bookings" element={<Layout><Bookings /></Layout>} />
            <Route path="/admin/users" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">User Management - Coming Soon</h1></div></Layout>} />
            <Route path="/admin/maintenance" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Maintenance Management - Coming Soon</h1></div></Layout>} />
            <Route path="/admin/analytics" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Analytics Dashboard - Coming Soon</h1></div></Layout>} />
            <Route path="/admin/docs" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">System Documentation - Coming Soon</h1></div></Layout>} />
            <Route path="/admin/settings" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">System Settings - Coming Soon</h1></div></Layout>} />
            
            {/* Agent Routes */}
            <Route path="/agent/vehicles" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">My Assigned Vehicles - Coming Soon</h1></div></Layout>} />
            <Route path="/agent/inspections" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Vehicle Inspections - Coming Soon</h1></div></Layout>} />
            <Route path="/agent/maintenance" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Maintenance Tasks - Coming Soon</h1></div></Layout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
