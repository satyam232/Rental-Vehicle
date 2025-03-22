
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleSearch } from "@/components/vehicle-search";
import { vehicleService } from "@/services/vehicle";
import type { VehicleData } from "@/services/vehicle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Grid2X2, 
  List, 
  Car, 
  ChevronDown, 
  ChevronUp,
  Filter as FilterIcon,
  X
} from "lucide-react";

export default function VehicleListings() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleData[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getVehicles();
        setVehicles(data);
        setError(null);
        const maxPrice = data.length > 0 ? Math.max(...data.map(v => v.price)) : 15000;
        setPriceRange([0, maxPrice]);
      } catch (err) {
        setError('Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);
  // Separate useEffect for URL parameter processing
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const normalizedType = typeParam.toLowerCase();
      setVehicleTypes(prev => 
        prev.includes(normalizedType) ? prev : [...prev, normalizedType]
      );
    }
  }, [searchParams]);

  // Main filter effect
  useEffect(() => {
    // Apply filters
    let filtered = vehicles;
  
    if (showAvailableOnly) {
      filtered = filtered.filter(vehicle => vehicle.available);
    }
  
    if (vehicleTypes.length > 0) {
      filtered = filtered.filter(vehicle => 
        vehicleTypes.some(t => vehicle.type.toLowerCase() === t)
      );
    }
  
    filtered = filtered.filter(vehicle => 
      vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1]
    );
  
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
  
    setFilteredVehicles(filtered);
  }, [vehicleTypes, priceRange, showAvailableOnly, sortBy, vehicles]);
  
  const toggleVehicleType = (type: string) => {
    setVehicleTypes(prev => {
      const normalizedType = type.toLowerCase();
      return prev.includes(normalizedType)
        ? prev.filter(t => t !== normalizedType)
        : [...prev, normalizedType];
    });
  };
  
  
  const clearFilters = () => {
    setVehicleTypes([]);
    setPriceRange([0, 1500]);
    setShowAvailableOnly(true);
    setSortBy("recommended");
  };
  
  const allVehicleTypes = [
    "economy", "compact", "midsize", "suv", "luxury", "van", "electric"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-grow pt-20">
        <div className="bg-secondary/30 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 animate-fade-in">Vehicle Listings</h1>
            <VehicleSearch className="animate-slide-up" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </Button>
            </div>
            
            {/* Filters - Sidebar */}
            <div 
              className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block animate-fade-in`}
            >
              <div className="glass-card p-6 rounded-xl sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={15000}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>₹{priceRange[0]}/day</span>
                      <span>₹{priceRange[1]}/day</span>
                    </div>
                  </div>
                  
                  {/* Vehicle Types */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Vehicle Type</h3>
                    <div className="space-y-2">
                      {allVehicleTypes.map(type => (
                        <div key={type} className="flex items-center">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={vehicleTypes.includes(type.toLowerCase())}
                            onCheckedChange={() => toggleVehicleType(type.toLowerCase())}
                          />
                          <label 
                            htmlFor={`type-${type}`}
                            className="ml-2 text-sm capitalize"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Availability</h3>
                    <div className="flex items-center">
                      <Checkbox 
                        id="available-only" 
                        checked={showAvailableOnly}
                        onCheckedChange={() => setShowAvailableOnly(!showAvailableOnly)}
                      />
                      <label 
                        htmlFor="available-only"
                        className="ml-2 text-sm"
                      >
                        Show available only
                      </label>
                    </div>
                  </div>
                  
                  {/* Mobile Close Button */}
                  <div className="lg:hidden pt-4">
                    <Button 
                      className="w-full"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vehicle Listings */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredVehicles.length} vehicles
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Recommended" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="hidden md:flex border border-border rounded-md">
                    <Button
                      variant={view === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setView("grid")}
                      className="rounded-none rounded-l-md"
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={view === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setView("list")}
                      className="rounded-none rounded-r-md"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* No results */}
              {filteredVehicles.length === 0 && (
                <div className="glass-card p-8 rounded-xl text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search criteria.
                  </p>
                  <Button onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
              
              {/* Vehicle Grid */}
              {view === "grid" && filteredVehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <VehicleCard vehicle={vehicle} />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Vehicle List */}
              {view === "list" && filteredVehicles.length > 0 && (
                <div className="space-y-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <div 
                      key={vehicle.id} 
                      className="glass-card rounded-xl overflow-hidden animate-fade-in" 
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="w-full h-full object-cover md:h-60"
                          />
                          {!vehicle.available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-medium px-3 py-1 bg-destructive rounded-md">
                                Unavailable
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="md:w-2/3 p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                                {vehicle.type}
                              </span>
                              <h3 className="text-xl font-medium mt-2">{vehicle.name}</h3>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 fill-primary text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <span className="text-sm font-medium ml-1">{vehicle.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 my-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              <span>{vehicle.seats} seats</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                              </svg>
                              <span>{vehicle.luggage} luggage</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="4" y="6" width="16" height="12" rx="2" />
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <path d="M8 12h8" />
                              </svg>
                              <span>{vehicle.transmission}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 14h3a2 2 0 0 0 2-2V8" />
                                <path d="M3 18h9a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9" />
                                <path d="M9 10H3" />
                                <path d="M17 18v-6" />
                                <path d="M21 18v-6" />
                              </svg>
                              <span>{vehicle.fuelType}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 flex items-end justify-between">
                            <div>
                              <span className="text-2xl font-semibold">₹{vehicle.price}/day</span>
                            </div>
                            <Link to={`/vehicles/${vehicle.id}`}>
                              <Button className="btn-hover">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
