import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { vehicleService } from "@/services/vehicle";
import { VehicleData } from "@/services/vehicle";
import { toast } from "@/components/ui/use-toast";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

import { Button } from "@/components/ui/button";
import { Users, Briefcase, Fuel, Gauge } from "lucide-react";
import { authService } from "@/services/auth";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('VehicleDetails mounted with ID:', id);
    const fetchVehicle = async () => {
      try {
        if (!id) {
          console.error('No vehicle ID found in URL parameters');
          throw new Error('Missing vehicle ID');
        }
        console.log('Vehicle ID from URL:', id);
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicle details",
        variant: "destructive"
      });
      navigate("/vehicles");
    } finally {
      setLoading(false);
    }
  };

  fetchVehicle();
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <p>Loading vehicle details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-6">Vehicle Not Found</h1>
              <p className="text-muted-foreground mb-8">The vehicle you're looking for doesn't exist.</p>
              <Link to="/vehicles">
                <Button variant="outline" className="btn-hover">Back to Listings</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookNow = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/signup', { state: { from: `/booking/${id}`, vehicleId: id } });
        return;
      }
      navigate(`/booking/${id}`, { state: { vehicleId: id } });
    } catch (error) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with booking",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/2">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-semibold text-primary">₹{vehicle.price}/day</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{vehicle.type}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={`text-sm font-medium ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                    {vehicle.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>{vehicle.luggage} Luggage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button 
                    className="btn-hover" 
                    disabled={!vehicle.available}
                    onClick={handleBookNow}
                  >
                    {vehicle.available ? 'Book This Vehicle' : 'Not Available'}
                  </Button>
                  <Link to="/vehicles">
                    <Button variant="outline" className="btn-hover">Back to Listings</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
