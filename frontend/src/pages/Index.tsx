
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { VehicleSearch } from "@/components/vehicle-search";
import { VehicleCard } from "@/components/vehicle-card";
import { Footer } from "@/components/footer";

import { ChevronRight, CreditCard, MapPin, Key, Clock, Shield, Car, LocateIcon, CalendarCheck, DollarSign } from "lucide-react";
import { authService } from "@/services/auth";
import { vehicleService } from "@/services/vehicle";
import type { VehicleData } from "@/services/vehicle";

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const user = await authService.getCurrentUser();
        setUserName(user?.name || null);
      }
    };
    checkAuth();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setFeaturedVehicles(data.filter(v => v.available).slice(0, 4));
        setVehiclesError(null);
      } catch (err) {
        setVehiclesError('Failed to load featured vehicles');
        setFeaturedVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    };
    loadFeaturedVehicles();
  }, []);

  const [featuredVehicles, setFeaturedVehicles] = useState<VehicleData[]>([]);
const [loadingVehicles, setLoadingVehicles] = useState(true);
const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      {/* Add user greeting */}
      {userName && ( 
        <div className="absolute top-24 left-8 z-20 flex items-center gap-2 text-lg">
          <span className="text-muted-foreground">Hi,</span>
          <span className="font-medium text-primary ">{userName}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/20" />
          <img 
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury car" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 pt-24">
          <div className="max-w-xl mb-20">
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Drive Your Way, <br />
              <span className="text-primary">Anytime</span>
            </h1>
            <p 
              className={`text-xl text-muted-foreground mb-8 transition-all duration-700 delay-200 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Premium vehicle rentals with flexible options and exceptional service. Experience the road with confidence and style.
            </p>
            <div 
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Link to="/vehicles">
                <Button size="lg" className="btn-hover">
                  Browse Vehicles
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button variant="outline" size="lg" className="btn-hover">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
          
          <div 
            className={`transition-all duration-700 delay-600 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <VehicleSearch />
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <a 
            href="#featured" 
            className="animate-bounce text-foreground/60 hover:text-primary transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>
      
      {/* Featured Vehicles */}
      <section id="featured" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Vehicles</h2>
            <p className="text-muted-foreground text-lg">
              Explore our top vehicles selected for quality, performance, and comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingVehicles ? (
          <div className="col-span-4 text-center py-12 text-muted-foreground animate-pulse">
            Loading vehicles...
          </div>
        ) : vehiclesError ? (
          <div className="col-span-4 text-center py-12 text-destructive">
            {vehiclesError}
          </div>
        ) : featuredVehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id} 
                className={`transition-all duration-700 animate-fade-in animate-delay-${index * 100}`}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/vehicles">
              <Button size="lg" className="btn-hover">
                View All Vehicles
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Renting a vehicle is easy with our simple 4-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-100">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Choose Your Vehicle</h3>
              <p className="text-muted-foreground">
                Browse our diverse fleet and select the perfect vehicle for your needs
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-200">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Pick Your Dates</h3>
              <p className="text-muted-foreground">
                Choose convenient pick-up and return dates that fit your schedule
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Make Payment</h3>
              <p className="text-muted-foreground">
                Secure payment process with transparent pricing and no hidden fees
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-fade-in animate-delay-400">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Key className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Enjoy Your Ride</h3>
              <p className="text-muted-foreground">
                Pick up your vehicle and start your journey with peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg">
              We offer more than just vehicle rentals - we provide an exceptional experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-100">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Comprehensive Insurance</h3>
              <p className="text-muted-foreground">
                Drive with confidence knowing you're fully covered with our comprehensive insurance options.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-200">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">24/7 Customer Support</h3>
              <p className="text-muted-foreground">
                Our team is available around the clock to assist you with any questions or issues.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-300">
              <CreditCard className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">No Hidden Fees</h3>
              <p className="text-muted-foreground">
                Transparent pricing with no surprise charges. What you see is what you pay.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-400">
              <LocateIcon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">GPS Navigation</h3>
              <p className="text-muted-foreground">
                All our vehicles come equipped with the latest GPS technology for easy navigation.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-500">
              <MapPin className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Multiple Locations</h3>
              <p className="text-muted-foreground">
                Convenient pick-up and drop-off points across major cities and airports.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl animate-fade-in animate-delay-600">
              <svg className="h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M8 12h8" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Free Cancellation</h3>
              <p className="text-muted-foreground">
                Plans changed? No problem. Free cancellation up to 24 hours before your rental.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
            alt="Cars background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Hit the Road?</h2>
            <p className="text-xl opacity-90 mb-8">
              Experience the freedom of the open road with our premium vehicle rental service. Book your perfect ride today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/vehicles">
                <Button variant="secondary" size="lg" className="btn-hover">
                  Browse Vehicles
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 btn-hover">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
