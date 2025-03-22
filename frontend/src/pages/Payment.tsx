import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentService } from "@/services/payment";
import { bookingService } from "@/services/booking";
import { vehicleService, VehicleData } from "@/services/vehicle";
import { toast } from "@/components/ui/use-toast";
import { PaymentForm } from "@/components/payment-form";

interface BookingDetails {
  startDate: string;
  endDate: string;
  numberOfDays: number;
  vehicleId: string;
  rentalFee: number;
  insurance: number;
  taxes: number;
  total: number;
}

export default function Payment() {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (!bookingId || !location.state) return;

    const fetchData = async () => {
      try {
        const { vehicleId, startDate, endDate } = location.state as BookingDetails;
        const vehicleData = await vehicleService.getVehicleById(vehicleId);
        
        setVehicle(vehicleData);
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        const rentalFee = vehicleData.price * numberOfDays;
        const insurance = Math.round(rentalFee * 0.15);
        const taxes = Math.round((rentalFee + insurance) * 0.1);
        const total = rentalFee + insurance + taxes;

        setBookingDetails({
          startDate,
          endDate,
          numberOfDays,
          vehicleId,
          rentalFee,
          insurance,
          taxes,
          total
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Authentication required')) {
          toast({
            title: "Session Expired",
            description: "Please log in again to continue",
            variant: "destructive"
          });
          navigate('/login');
        } else {
          toast({
            title: "Error",
            description: "Failed to load booking details",
            variant: "destructive"
          });
        }
      }
    };

    fetchData();
  }, [bookingId, location.state]);

  const handlePaymentComplete = async (paymentMethod: string, paymentDetails: any) => {
    if (!bookingDetails || !bookingId) return;
    
    setIsLoading(true);
    try {
      // await paymentService.processPayment({
      //   bookingId: bookingId,
      //   amount: bookingDetails.total,
      //   paymentMethod,
      //   paymentDetails
      // });
      // var data=setBookingDetails
      await bookingService.createBooking({
        vehicleId: bookingDetails.vehicleId,
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        totalAmount: bookingDetails.total,
      })

      await bookingService.confirmBooking(bookingId);
      
      toast({
        title: "Success",
        description: `Your payment of $₹{bookingDetails.total.toFixed(2)} has been processed successfully.`
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Payment Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Payment failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>
            <p className="text-muted-foreground mb-8">
              Booking Reference: {bookingId}
            </p>
            
            {bookingDetails ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Review your booking details before payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rental Period</span>
                      <span>
                        {new Date(bookingDetails.startDate).toLocaleString()} -{" "}
                        {new Date(bookingDetails.endDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{bookingDetails.numberOfDays} days</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Rental Fee (${vehicle?.price}/day × {bookingDetails.numberOfDays} days)
                    </span>
                    <span>₹{bookingDetails.rentalFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance (15%)</span>
                    <span>₹{bookingDetails.insurance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes (10%)</span>
                    <span>₹{bookingDetails.taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{bookingDetails.total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Please proceed to complete your payment using your preferred payment method.
                  </p>
                </CardFooter>
              </Card>
            ) : (
              <Card className="mb-8">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Loading booking details...</p>
                </CardContent>
              </Card>
            )}
            
            {bookingDetails && (
              <PaymentForm 
                amount={bookingDetails.total}
                onPaymentComplete={handlePaymentComplete}
                disabled={isLoading}
              />
            )}
            <div className="mt-6">
              <Link to="/dashboard">
                <Button variant="outline" className="btn-hover">
                  View All Bookings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
