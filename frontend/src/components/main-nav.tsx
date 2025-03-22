
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Car } from "lucide-react";
import { authService } from '@/services/auth';

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    };
    checkAuth();
  }, [location]);

  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    setIsAuthenticated(isAuth);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    await checkAuth();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Vehicles", path: "/vehicles" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
    ...(isAuthenticated ? [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Settings", path: "/settings" }
    ] : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
              <Car className="h-6 w-6 text-primary" />
              <span className="hidden sm:inline">VehicleRental</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-md transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary font-medium" : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="btn-hover">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="btn-hover">
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="btn-hover">
                    Log out
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background animate-fade-in">
          <nav className="flex flex-col p-6 space-y-4">

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-3 text-base rounded-md ${
                  location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full justify-center">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full justify-center">
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
