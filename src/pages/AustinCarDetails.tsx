import { Icon } from "@iconify/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

const AustinCarDetails = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [premiumInsurance, setPremiumInsurance] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicle details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a vehicle",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    navigate(`/book/${vehicleId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Icon icon="solar:loader-bold" className="size-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Icon icon="solar:car-bold" className="size-20 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle not found</h2>
        <Link to="/austin/browse-cars" className="text-primary font-semibold">
          Browse available vehicles
        </Link>
      </div>
    );
  }

  const images = vehicle.image_url 
    ? [vehicle.image_url]
    : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80',
      ];

  const rentalDays = 3;
  const dailyRate = vehicle.daily_rate || 49;
  const subtotal = dailyRate * rentalDays;
  const insuranceCost = premiumInsurance ? 15 * rentalDays : 0;
  const total = subtotal + insuranceCost;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/austin/browse-cars" className="flex items-center justify-center size-11">
            <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold font-heading text-foreground">Car Details</h1>
          <button className="flex items-center justify-center size-11">
            <Icon icon="solar:heart-bold" className="size-6 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="relative bg-secondary">
          <div className="aspect-[16/10] overflow-hidden">
            <img
              alt={`${vehicle.make} ${vehicle.model}`}
              src={images[currentImageIndex]}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`size-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-primary w-6' 
                    : 'bg-white opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {vehicle.type}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        icon="solar:star-bold"
                        className={`size-5 ${
                          star <= 4 
                            ? 'text-yellow-500' 
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium text-foreground ml-1">4.8</span>
                    <span className="text-sm text-muted-foreground">(124)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon icon="solar:users-group-rounded-bold" className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                  <p className="font-semibold text-foreground">{vehicle.capacity || 5} People</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon icon="solar:bag-bold" className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Luggage</p>
                  <p className="font-semibold text-foreground">3 Bags</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon icon="solar:settings-bold" className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-semibold text-foreground">{vehicle.transmission || 'Automatic'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon icon="solar:fuel-bold" className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-semibold text-foreground">{vehicle.fuel_type || 'Gasoline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon icon="solar:speedometer-bold" className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-semibold text-foreground">{vehicle.mileage || '32 MPG'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">
              Features & Amenities
            </h3>
            <div className="space-y-3">
              {[
                'Air Conditioning',
                'GPS Navigation',
                'Bluetooth Audio',
                'USB Charging Ports',
                'Backup Camera',
                'Cruise Control',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="solar:check-circle-bold" className="size-5 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">Pricing Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Daily Rate</span>
                <span className="font-semibold text-foreground">${dailyRate.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Rental Period ({rentalDays} days)</span>
                <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-foreground font-medium">Insurance Options</span>
                </div>
                <div className="space-y-3">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                      !premiumInsurance ? 'bg-secondary' : 'border border-border'
                    }`}
                    onClick={() => setPremiumInsurance(false)}
                  >
                    <div className={`size-5 rounded flex items-center justify-center ${
                      !premiumInsurance ? 'bg-primary' : 'border-2 border-muted-foreground'
                    }`}>
                      {!premiumInsurance && (
                        <Icon icon="solar:check-circle-bold" className="size-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">Basic Coverage</p>
                      <p className="text-xs text-muted-foreground">Included in rental</p>
                    </div>
                    <span className="font-semibold text-foreground">$0.00</span>
                  </div>
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                      premiumInsurance ? 'bg-secondary' : 'border border-border'
                    }`}
                    onClick={() => setPremiumInsurance(true)}
                  >
                    <div className={`size-5 rounded flex items-center justify-center ${
                      premiumInsurance ? 'bg-primary' : 'border-2 border-muted-foreground'
                    }`}>
                      {premiumInsurance && (
                        <Icon icon="solar:check-circle-bold" className="size-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">Premium Coverage</p>
                      <p className="text-xs text-muted-foreground">Full protection upgrade</p>
                    </div>
                    <span className="font-semibold text-foreground">+$15.00/day</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-heading text-foreground">Estimated Total</span>
                  <span className="text-2xl font-bold font-heading text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-bold font-heading text-foreground mb-4">Pickup & Return</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:map-point-bold" className="size-5 text-primary" />
                  <span className="font-semibold text-foreground">Pickup Location</span>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  {vehicle.location || 'Nairobi, Kenya'}
                </p>
                <p className="text-sm text-muted-foreground pl-7">Jan 15, 2024 at 10:00 AM</p>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:map-point-bold" className="size-5 text-accent" />
                  <span className="font-semibold text-foreground">Return Location</span>
                </div>
                <p className="text-sm text-muted-foreground pl-7">
                  {vehicle.location || 'Nairobi, Kenya'}
                </p>
                <p className="text-sm text-muted-foreground pl-7">Jan 18, 2024 at 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
        <button
          onClick={handleBookNow}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Book Now
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 h-20">
          <Link to="/austin/home" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon icon="solar:home-2-bold" className="size-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/austin/browse-cars" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon icon="solar:magnifer-linear" className="size-6" />
            <span className="text-xs font-medium">Browse</span>
          </Link>
          <Link to="/bookings" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon icon="solar:calendar-bold" className="size-6" />
            <span className="text-xs font-medium">Bookings</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon icon="solar:user-bold" className="size-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AustinCarDetails;
