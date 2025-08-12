import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Page Not Found | Lone Star Wash & Dry";
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const phone = "[PHONE]"; // TODO: replace with real number

  return (
    <div>
      {/* Responsive Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Far Left */}
            <a href="/" className="flex items-center gap-2 font-extrabold text-xl transition-transform duration-200 hover:scale-105">
              <Sparkles className="text-accent" />
              <span className="hidden sm:inline">Lone Star Wash & Dry</span>
              <span className="sm:hidden">LSWD</span>
            </a>

            {/* Navigation - Center */}
            <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-6">
              <a 
                href="/#services" 
                className="text-sm font-medium relative group transition-all duration-200 hover:text-accent"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a 
                href="/#pricing" 
                className="text-sm font-medium relative group transition-all duration-200 hover:text-accent"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a 
                href="/#reviews" 
                className="text-sm font-medium relative group transition-all duration-200 hover:text-accent"
              >
                Locations & Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a 
                href="/book-pickup" 
                className="text-sm font-medium relative group transition-all duration-200 hover:text-accent"
              >
                Book Pickup
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
              </a>
            </nav>

            {/* Login Button - Far Right */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="hidden sm:inline-flex transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Login
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border/50">
              <div className="flex flex-col gap-3 pt-4">
                <a 
                  href="/#services" 
                  className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a 
                  href="/#pricing" 
                  className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="/#reviews" 
                  className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Locations & Reviews
                </a>
                <a 
                  href="/book-pickup" 
                  className="text-sm font-medium py-2 px-3 rounded-md hover:bg-accent/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Pickup
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* 404 Content */}
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <Sparkles className="text-accent mx-auto mb-4" size={64} />
            <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
            <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/">
              <Button size="lg" className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <Home className="mr-2" size={20} />
                Return Home
              </Button>
            </a>
            <button 
              onClick={() => window.history.back()}
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 inline-flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
