
import { useAuth } from '@/hooks/useAuth';
import { CustomerDashboard } from '@/components/dashboards/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AgentDashboard } from '@/components/dashboards/AgentDashboard';

const Dashboard = () => {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
    default:
      return <CustomerDashboard />;
  }
};

export default Dashboard;
