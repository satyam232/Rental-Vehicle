
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, UsersIcon, BriefcaseIcon, FuelIcon } from "lucide-react";

export interface VehicleProps {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  rating: number;
  seats: number;
  luggage: number;
  transmission: string;
  fuelType: string;
  available: boolean;
}

export function VehicleCard({ vehicle }: { vehicle: VehicleProps }) {
  const { id, name, type, image, price, rating, seats, luggage, transmission, fuelType, available } = vehicle;

  return (
    <div className="group h-full glass-card rounded-2xl overflow-hidden flex flex-col animate-scale-in transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-1 px-3">Unavailable</Badge>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary/90">{type}</Badge>
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{name}</h3>
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 fill-primary text-primary mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 my-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            <span>{seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <BriefcaseIcon className="h-4 w-4" />
            <span>{luggage} luggage</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="6" width="16" height="12" rx="2" />
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M8 12h8" />
            </svg>
            <span>{transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <FuelIcon className="h-4 w-4" />
            <span>{fuelType}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <span className="text-2xl font-semibold">₹{price}</span>
            <span className="text-muted-foreground text-sm">/day</span>
          </div>
          <Link to={available ? `/vehicles/${id}` : "#"}>
            <Button disabled={!available} className="btn-hover">
              {available ? "View Details" : "Unavailable"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
