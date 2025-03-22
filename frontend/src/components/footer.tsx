
import { Link } from "react-router-dom";
import { Car, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 dark:bg-secondary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Car className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl">VehicleRental</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Premium vehicle rental services with flexible options and exceptional customer care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">Vehicle Types</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/vehicles?type=economy" className="text-muted-foreground hover:text-primary transition-colors">
                  Economy Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=luxury" className="text-muted-foreground hover:text-primary transition-colors">
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=suv" className="text-muted-foreground hover:text-primary transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=van" className="text-muted-foreground hover:text-primary transition-colors">
                  Vans
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=electric" className="text-muted-foreground hover:text-primary transition-colors">
                  Electric Vehicles
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Bhubaneshwar, Odisha, India 751002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 9114128523
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@vehiclerental.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@vehiclerental.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VehicleRental. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookies Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
