import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    document.title = "Page Not Found | Lone Star Wash & Dry";
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);


  return (
    <div>




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
