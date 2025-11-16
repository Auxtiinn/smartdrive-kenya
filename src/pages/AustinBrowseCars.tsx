import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

const AustinBrowseCars = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available');

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query.order('daily_rate');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Cars', icon: 'solar:car-bold' },
    { id: 'sedan', label: 'Sedan', icon: 'solar:car-bold' },
    { id: 'suv', label: 'SUV', icon: 'solar:car-bold' },
    { id: 'luxury', label: 'Luxury', icon: 'solar:star-bold' },
    { id: 'electric', label: 'Electric', icon: 'solar:battery-charge-bold' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/austin/home" className="flex items-center justify-center size-11">
            <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold font-heading text-foreground">Browse Cars</h1>
          <button className="flex items-center justify-center size-11">
            <Icon icon="solar:filter-bold" className="size-6 text-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Icon icon="solar:magnifer-linear" className="size-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground shadow-sm"
              placeholder="Search for cars..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  filter === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border'
                }`}
              >
                <Icon icon={category.icon} className="size-5" />
                <span className="font-medium text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon icon="solar:loader-bold" className="size-8 text-primary animate-spin" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="solar:car-bold" className="size-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No vehicles found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {vehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/austin/car-details/${vehicle.id}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/10] bg-secondary overflow-hidden">
                    <img
                      alt={`${vehicle.make} ${vehicle.model}`}
                      src={vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold font-heading text-foreground mb-1">
                          {vehicle.make} {vehicle.model} {vehicle.year}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                            {vehicle.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <Icon icon="solar:star-bold" className="size-4 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:users-group-rounded-bold" className="size-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{vehicle.capacity || 5}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:settings-bold" className="size-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{vehicle.transmission || 'Auto'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:fuel-bold" className="size-5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{vehicle.fuel_type || 'Gas'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                        <p className="text-2xl font-bold font-heading text-primary">
                          ${vehicle.daily_rate}
                          <span className="text-sm font-normal text-muted-foreground">/day</span>
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 h-20">
          <Link to="/austin/home" className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon icon="solar:home-2-bold" className="size-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/austin/browse-cars" className="flex flex-col items-center justify-center gap-1 text-primary">
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

export default AustinBrowseCars;
