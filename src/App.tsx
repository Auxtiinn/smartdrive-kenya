import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Layout } from "@/components/Layout";
import { SplashScreen } from "@/components/SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import FleetManagement from "./pages/admin/FleetManagement";
import UserManagement from "./pages/admin/UserManagement";
import Maintenance from "./pages/admin/Maintenance";
import Analytics from "./pages/admin/Analytics";
import SystemDocs from "./pages/admin/SystemDocs";
import SystemSettings from "./pages/admin/SystemSettings";
import MyVehicles from "./pages/agent/MyVehicles";
import Inspections from "./pages/agent/Inspections";
import AgentMaintenance from "./pages/agent/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isVisible } = useSplashScreen();

  return (
    <>
      <SplashScreen isVisible={isVisible} />
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
        <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />
        <Route path="/admin/maintenance" element={<Layout><Maintenance /></Layout>} />
        <Route path="/admin/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/admin/docs" element={<Layout><SystemDocs /></Layout>} />
        <Route path="/admin/settings" element={<Layout><SystemSettings /></Layout>} />
        
        {/* Agent Routes */}
        <Route path="/agent/vehicles" element={<Layout><MyVehicles /></Layout>} />
        <Route path="/agent/inspections" element={<Layout><Inspections /></Layout>} />
        <Route path="/agent/maintenance" element={<Layout><AgentMaintenance /></Layout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
