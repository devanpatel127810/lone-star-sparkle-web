import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  const links = useMemo(
    () => [
      { label: "Services", href: isHome ? "#services" : "/#services" },
      { label: "Pricing", href: isHome ? "#pricing" : "/#pricing" },
      { label: "Locations & Reviews", href: isHome ? "#reviews" : "/#reviews" },
      { label: "Book Pickup", href: "/book-pickup" },
    ],
    [isHome]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl flex-shrink-0"
          >
            <span className="hidden lg:inline">Lone Star Wash & Dry</span>
            <span className="hidden sm:inline lg:hidden">Lone Star</span>
            <span className="sm:hidden">LSWD</span>
          </a>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6 mx-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium relative group hover:text-accent whitespace-nowrap ${
                  location.pathname === "/book-pickup" && link.href === "/book-pickup" ? "text-accent" : ""
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-[width] duration-200" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="hidden sm:inline-flex hover:bg-accent hover:text-accent-foreground"
            >
              Login
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col gap-3 pt-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-2 px-3 rounded-md hover:bg-accent/10 transition-colors duration-200 ${
                    location.pathname === "/book-pickup" && link.href === "/book-pickup" ? "bg-accent/10 text-accent" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;