
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSplashScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Heavy pages that should show splash screen
  const heavyPages = [
    '/admin/fleet',
    '/admin/analytics',
    '/admin/users',
    '/admin/maintenance',
    '/vehicles',
    '/bookings'
  ];

  useEffect(() => {
    const isHeavyPage = heavyPages.some(page => location.pathname.startsWith(page));
    
    if (isHeavyPage && !isLoading) {
      setIsLoading(true);
      setIsVisible(true);
      
      // Simulate loading time with minimum display duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsLoading(false);
      }, 1500); // Show for 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return { isVisible, isLoading };
};
