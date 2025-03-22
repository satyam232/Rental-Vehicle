import { useState, useEffect } from "react";
import { bookingService } from "@/services/booking";
import { vehicleService } from "@/services/vehicle";
import { Route, Routes } from "react-router-dom";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings } from "./Settings";

function DashboardHome() {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userBookings = await bookingService.getBookings();
        const availableVehicles = await vehicleService.getVehicles();
        setBookings(userBookings || []);
        setVehicles(availableVehicles || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Your Bookings</h1>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Rental</h2>
          <div className="bg-secondary rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-muted-foreground text-sm">Vehicle</h3>
                <p className="text-lg font-semibold">{bookings[0]["vehicleId"]?.name || "Unknown"}</p>
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Due Date</h3>
                <p className="text-lg font-semibold">
                  {bookings[0]?.endDate ? new Date(bookings[0].endDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Total Charges</h3>
                <p className="text-lg font-semibold text-primary">
                ₹{bookings[0]?.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  bookings[0]?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {bookings[0]?.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-secondary rounded-lg p-4 text-center">
          <p className="text-muted-foreground">No active bookings found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardStat title="Upcoming Trips" value="3" />
        <DashboardStat title="Vehicles Available" value={vehicles.length.toString()} />
        <DashboardStat title="Total Spent" value="$2,420" />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <RecentBookings />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Explore More Vehicles</h2>
        <VehicleGrid vehicles={vehicles} />
      </div>
    </div>
  );
}

function DashboardStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-secondary rounded-lg p-4">
      <h3 className="text-muted-foreground text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function RecentBookings() {
  return (
    <div className="bg-secondary rounded-lg p-4">
      <div className="grid grid-cols-4 gap-4 font-medium pb-2">
        <span>Booking ID</span>
        <span>Vehicle</span>
        <span>Date</span>
        <span>Status</span>
      </div>
      <div className="space-y-2">
        {["#2456", "#2457", "#2458"].map((id) => (
          <div key={id} className="grid grid-cols-4 gap-4 py-2 hover:bg-muted/50 rounded-md">
            <span>{id}</span>
            <span>Tesla Model 3</span>
            <span>2024-03-15</span>
            <span className="text-green-500">Confirmed</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleGrid({ vehicles }: { vehicles: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-secondary rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{vehicle.name}</h3>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                vehicle.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {vehicle.available ? "Available" : "Booked"}
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">{vehicle.type}</p>
            <p className="font-medium text-primary">${vehicle.price}/day</p>
          </div>
        </div>
      ))}
    </div>
  );
}



function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 delay-100" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'Profile not found'}
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold animate-fade-in">{user.name}'s Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-lg p-6 space-y-4 transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold animate-fade-in">Personal Information</h2>
          <div className="space-y-2">
          <p><span className="text-muted-foreground">Email:</span> {user.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
            <p><span className="text-muted-foreground">Member Since:</span> 
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="bg-secondary rounded-lg p-6 space-y-4 transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold animate-fade-in delay-100">Account Details</h2>
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Total Bookings:</span> {user.bookings?.length || 0}</p>
            <p><span className="text-muted-foreground">Preferred Vehicle:</span> 
              {user.preferences?.vehicleType || 'None'}
            </p>
          </div>
          <Button variant="outline" className="mt-4">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold">Dashboard Menu</h2>
              <nav className="flex flex-col space-y-1">
                {["Overview", "Bookings", "Profile", "Settings"].map((item) => (
                  <a
                    key={item}
                    href={`/dashboard/${item.toLowerCase()}`}
                    className="px-4 py-2 rounded-md hover:bg-secondary"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <div className="md:col-span-3">
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/overview" element={<DashboardHome />} />
                <Route path="/bookings" element={<div>Bookings Page (Placeholder)</div>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
