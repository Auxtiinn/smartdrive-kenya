import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  DollarSign,
  Users,
  Car,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];

const fetchAnalytics = async () => {
  // 1. Monthly revenue and bookings (last 6 months)
  const now = new Date();
  const startMonth = subMonths(startOfMonth(now), 5);
  const monthData: {
    month: string;
    revenue: number;
    bookings: number;
  }[] = [];

  for (let i = 0; i < 6; i++) {
    const from = startOfMonth(subMonths(now, 5 - i));
    const to = endOfMonth(subMonths(now, 5 - i));

    // Revenue (completed bookings in this month)
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("total_cost, status, created_at", { count: "exact" })
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());

    if (error) throw error;
    const completed = (bookings ?? []).filter((b) => b.status === "completed");
    const revenue = completed.reduce(
      (sum, curr) => sum + (Number(curr.total_cost) || 0),
      0
    );
    const allBookings = bookings?.length || 0;

    monthData.push({
      month: MONTH_LABELS[from.getMonth()],
      revenue,
      bookings: allBookings,
    });
  }

  // 2. Vehicle breakdown: type
  const { data: vehiclesType, error: errorVehicles } = await supabase
    .from("vehicles")
    .select("type");
  if (errorVehicles) throw errorVehicles;

  const typeCounts = vehiclesType
    ? vehiclesType.reduce<{ [key: string]: number }>((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {})
    : {};
  
  const colorPalette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#5555ee",
    "#e970e7",
    "#a9d634",
  ];
  const vehicleTypeData = Object.keys(typeCounts).map((type, i) => ({
    name: type,
    value: typeCounts[type],
    color: colorPalette[i % colorPalette.length],
  }));

  // 3. Total Revenue, Bookings, Utilization, Customers
  // All time
  const { data: vehicles, error: fleetErr } = await supabase
    .from("vehicles")
    .select("status");

  if (fleetErr) throw fleetErr;
  const { data: profiles, error: userErr, count: customersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });
  if (userErr) throw userErr;

  const { data: bookingsAll, error: allBookingsErr } = await supabase
    .from("bookings")
    .select("id, status");
  if (allBookingsErr) throw allBookingsErr;

  // Total revenue: all time
  const { data: allRevenueRows, error: allRevErr } = await supabase
    .from("bookings")
    .select("total_cost, status");
  if (allRevErr) throw allRevErr;

  const totalRevenue = (allRevenueRows ?? [])
    .filter((b) => b.status === "completed")
    .reduce((sum, curr) => sum + (Number(curr.total_cost) || 0), 0);

  // Active bookings: confirmed/active
  const activeBookings = (bookingsAll ?? []).filter(
    (b) => b.status === "active" || b.status === "confirmed"
  ).length;

  // Fleet Utilization: rented / total
  const totalVehicles = vehicles?.length || 0;
  const rented = (vehicles ?? []).filter((v) => v.status === "rented").length;
  const utilization =
    totalVehicles > 0 ? ((rented / totalVehicles) * 100).toFixed(1) : "0.0";

  // Total customers
  // Use the correct customersCount from the metadata
  const customersCount = customersCount || 0;

  return {
    revenueData: monthData,
    vehicleTypeData,
    totalRevenue,
    activeBookings,
    utilization,
    customersCount,
  };
};

const Analytics = () => {
  const { toast } = useToast();
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAnalytics,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading analytics",
        description: (error as Error)?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
      </div>
      {isLoading ? (
        <div className="my-8 text-center text-muted-foreground">Loading analytics...</div>
      ) : error ? (
        <div className="my-8 text-center text-destructive">Failed to load analytics.</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* Optional: compute % change from last month */}
                  Latest stats from completed bookings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Confirmed and active rentals
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.utilization}%</div>
                <p className="text-xs text-muted-foreground">
                  Rented / total vehicles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.customersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered customers
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and booking trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Type Distribution</CardTitle>
                <CardDescription>
                  Fleet composition by vehicle type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.vehicleTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.vehicleTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Bookings</CardTitle>
              <CardDescription>
                Number of bookings per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="my-8 text-muted-foreground">No analytics data found.</div>
      )}
    </div>
  );
};

export default Analytics;
