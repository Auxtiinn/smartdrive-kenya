
import { Car } from 'lucide-react';

interface SplashScreenProps {
  isVisible: boolean;
}

export const SplashScreen = ({ isVisible }: SplashScreenProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Car Logo */}
        <div className="relative mb-8">
          <div className="animate-bounce">
            <Car className="h-24 w-24 text-white mx-auto" />
          </div>
          {/* Road effect */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse rounded-full"></div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
          SmartDrive
        </h1>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        <p className="text-white/80 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Loading your journey...
        </p>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full mix-blend-multiply animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};
