
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingsContextType {
  currency: string;
  maintenanceMode: boolean;
  darkMode: boolean;
  autoBackup: boolean;
  updateSetting: (key: string, value: string) => Promise<void>;
  toggleDarkMode: () => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState('USD');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    
    // Check localStorage for dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      data?.forEach((setting) => {
        switch (setting.key) {
          case 'currency':
            setCurrency(setting.value);
            break;
          case 'maintenance_mode':
            setMaintenanceMode(setting.value === 'true');
            break;
          case 'auto_backup':
            setAutoBackup(setting.value === 'true');
            break;
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) throw error;

      // Update local state
      switch (key) {
        case 'currency':
          setCurrency(value);
          break;
        case 'maintenance_mode':
          setMaintenanceMode(value === 'true');
          break;
        case 'auto_backup':
          setAutoBackup(value === 'true');
          break;
      }

      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <SettingsContext.Provider value={{
      currency,
      maintenanceMode,
      darkMode,
      autoBackup,
      updateSetting,
      toggleDarkMode,
      loading
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
