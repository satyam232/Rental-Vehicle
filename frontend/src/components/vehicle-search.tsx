
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function VehicleSearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleSearch = () => {
    // In a real app, we would encode these parameters properly
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (vehicleType) params.append('type', vehicleType);
    if (pickupDate) params.append('pickup', pickupDate.toISOString());
    if (returnDate) params.append('return', returnDate.toISOString());
    
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div className={cn("glass-card p-6 rounded-xl w-full max-w-5xl mx-auto", className)}>
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="w-full md:w-1/4 space-y-2">
          <label className="text-sm font-medium">Pick-up Location</label>
          <Input 
            placeholder="Enter city or airport" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-1/5 space-y-2">
          <label className="text-sm font-medium">Vehicle Type</label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="midsize">Midsize</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/5 space-y-2">
          <label className="text-sm font-medium">Pick-up Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {pickupDate ? format(pickupDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full md:w-1/5 space-y-2">
          <label className="text-sm font-medium">Return Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate ? format(returnDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
                disabled={(date) => date < (pickupDate || new Date())}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          className="w-full md:w-auto"
          size="lg"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
