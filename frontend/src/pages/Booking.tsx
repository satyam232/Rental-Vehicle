
import { useParams, useLocation } from "react-router-dom";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const vehicleId = location.state?.vehicleId || id || "";

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <BookingForm vehicleId={vehicleId} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
