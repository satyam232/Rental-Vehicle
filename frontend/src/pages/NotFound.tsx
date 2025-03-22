
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-12 max-w-lg mx-auto rounded-2xl">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-medium mt-4 mb-6">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/">
                <Button className="btn-hover">
                  Return to Home
                </Button>
              </Link>
              <Link to="/vehicles">
                <Button variant="outline" className="btn-hover">
                  Browse Vehicles
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
