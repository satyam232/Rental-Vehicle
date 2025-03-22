"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { bookingService } from "@/services/booking"
import { vehicleService, VehicleData } from "@/services/vehicle"
import { toast } from "@/components/ui/use-toast"
import { authService } from "@/services/auth"
import { Clock } from "lucide-react"
import { Label } from "recharts"
import { Input } from "./ui/input"

interface BookingFormProps {
  vehicleId: string
}

export function BookingForm({ vehicleId }: BookingFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) {
      toast({
        title: "Error",
        description: "Missing vehicle identification",
        variant: "destructive"
      });
      navigate('/vehicles');
      return;
    }

    const fetchVehicle = async () => {
      try {
        const data = await vehicleService.getVehicleById(vehicleId);
        setVehicle(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load vehicle details',
          variant: "destructive"
        });
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setError("End date must be after start date");
      setEndDate(undefined);
    } else {
      setError(undefined);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!authService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to book a vehicle",
        variant: "destructive"
      });
      navigate('/signup', { state: { vehicleId } });
      return;
    }

    if (!startDate || !endDate || !vehicle) {
      toast({
        title: "Error",
        description: "Please select both start and end dates and times",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

    try {
    //   const { id } = await authService.getCurrentUser()
    
      navigate(`/payment/${vehicleId}`, {
        state: {
          vehicleId,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          price: vehicle.price
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading vehicle details...
      </div>
    );
  }

  if (!vehicle || error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error || 'Vehicle not found'}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/vehicles')}
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book {vehicle.name}</CardTitle>
        <CardDescription>Select your rental period</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            label="Start Date"
            disabled={loading || !vehicle.available}
          />
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-sm font-medium">Start Time</Label>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-background"
              disabled={loading || !vehicle.available}
            />
          </div>
        </div>
        <div className="space-y-2">
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            label="End Date"
            disabled={loading || !vehicle.available || !startDate}
          />
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-sm font-medium">End Time</Label>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-background"
              disabled={loading || !vehicle.available || !startDate}
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-2">Vehicle Details:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Price per day:</span>
              <span className="ml-2">₹{vehicle.price}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2">{vehicle.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Seats:</span>
              <span className="ml-2">{vehicle.seats}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Transmission:</span>
              <span className="ml-2">{vehicle.transmission}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isLoading || !vehicle.available || !startDate || !endDate || !!error}
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
