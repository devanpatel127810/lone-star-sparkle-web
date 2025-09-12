import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, Sparkles, Star, Quote, WashingMachine, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-lone-star.webp";
import { useEffect, useState } from "react";
import site from "@/content/site.json";
import { getAllLocationReviews, LocationReviews } from "@/lib/simpleReviewsApi";

const Index = () => {
  const [reviews, setReviews] = useState<LocationReviews[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Helper function to generate a unique summary based on review content and location
  const generateSummary = (text: string, location: string, index: number): string => {
    
    // Manually curated unique summaries based on actual review content
    const uniqueSummaries = {
      'Lewisville, TX': [
        'Wonderful facility with exceptional cleanliness!', // David Martin - focuses on "wonderful spot" and "very clean"
        'Helpful staff with reliable older machines!' // Jessica Flores - focuses on "helpful staff" and "machines look older"
      ],
      'Farmers Branch, TX': [
        'Go-to choice despite closer options nearby!', // Michael A - focuses on being preferred over closer location
        'Nicest wash & fold experience in the area!' // Marc Traynor - focuses on being "nicest so far"
      ],
      'Hurst, TX': [
        'Friendly attendants with honest, helpful service!', // Katey - focuses on "friendly, honest, helpful attendants"
        'Great prices with well-kept facilities!' // kay bee - focuses on "GREAT prices" and "well-kept"
      ]
    };
    
    // Return the specific summary for this location and index
    const locationSummaries = uniqueSummaries[location as keyof typeof uniqueSummaries];
    if (locationSummaries && locationSummaries[index]) {
      return locationSummaries[index];
    }
    
    // Fallback if location not found
    return 'Outstanding laundry service experience!';
  };

  // Helper function to toggle review expansion
  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  // Helper function to check if review is long
  const isLongReview = (text: string): boolean => {
    return text.length > 150;
  };

  useEffect(() => {
    document.title = "Lone Star Wash and Dry | DFW Laundromat";

    // Fetch real reviews
    const fetchReviews = async () => {
      try {
        const apiReviews = await getAllLocationReviews();
        if (apiReviews.length > 0) {
          setReviews(apiReviews);
          console.log('Loaded real reviews:', apiReviews);
        } else {
          console.log('No API reviews found, using fallback');
          setUseFallback(true);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setUseFallback(true);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();

    // Scroll observer for float-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    const floatElements = document.querySelectorAll('.float-in, .float-in-left, .float-in-right');
    floatElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const phone = site.phone;
  const address = site.address;
  const mapQuery = site.mapQuery;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    image: "https://lovable.dev/opengraph-image-p98pqg.png",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "DFW",
      addressRegion: "TX",
      postalCode: site.zip,
      addressCountry: "US",
    },
    url: site.website,
    sameAs: [
      `https://maps.google.com/?q=${mapQuery}`
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "21:30",
      },
    ],
    priceRange: "$$",
    areaServed: "Dallas–Fort Worth",
  };

  return (
    <div>
      <main>
        {/* Ultra-Modern Hero Section - Dark Lone Star Theme */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={heroImg}
              alt="Clean, modern laundromat with rows of stainless steel washers and dryers in DFW"
              className="w-full h-full object-cover scale-110 opacity-15"
              loading="eager"
              decoding="async"
            />
            {/* Multi-layer gradient overlays - Red, White, Blue theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-slate-800/90 to-blue-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-transparent to-blue-600/15" />
          </div>

          {/* 3D Floating Geometric Elements - Muted Lone Star Colors */}
          <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl animate-pulse transform rotate-12" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-red-500/15 to-red-600/15 rounded-full blur-2xl animate-pulse delay-1000 transform -rotate-12" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-white/10 to-slate-300/10 rounded-lg blur-lg animate-pulse delay-500 transform rotate-45" />
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-400/15 to-blue-500/15 rounded-full blur-xl animate-pulse delay-700 transform -rotate-45" />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
          </div>

          {/* Glassmorphism Main Content - Dark Lone Star Theme */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="mb-12">
              {/* Glassmorphism Badge - Lone Star Colors */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
                <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-blue-500 rounded-full animate-pulse" />
                <Sparkles className="w-5 h-5 text-white/80 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-white/95 text-sm font-semibold tracking-wide">Premium Laundry Services</span>
              </div>
              
              {/* Ultra-Modern Typography - Lone Star Colors */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 text-white leading-none tracking-tight">
                <span className="block bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent animate-pulse">
                  FAST.
                </span>
                <span className="block bg-gradient-to-r from-red-400 via-red-300 to-red-200 bg-clip-text text-transparent animate-pulse delay-300">
                  FRESH.
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent animate-pulse delay-700">
                  CLEAN.
                </span>
              </h1>
              
              {/* Modern Subtitle - Lone Star Colors */}
              <p className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Experience the <span className="text-blue-400 font-semibold">future of laundry</span> with our 
                <span className="text-white font-semibold"> state-of-the-art facilities</span> and 
                <span className="text-red-400 font-semibold"> premium wash & fold service</span>
              </p>
            </div>

            {/* Ultra-Modern CTA Buttons - Lone Star Colors */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <a href="/book-pickup" className="group">
                <div className="relative">
                  {/* Glow Effect - Lone Star Colors */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  {/* Main Button */}
                  <Button 
                    size="lg" 
                    className="relative bg-gradient-to-r from-red-600 via-slate-700 to-blue-600 hover:from-red-500 hover:via-slate-600 hover:to-blue-500 text-white px-10 py-5 text-lg font-bold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 rounded-2xl border border-white/20 backdrop-blur-sm"
                  >
                    <Truck className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    Book Pickup & Delivery
                  </Button>
                </div>
              </a>
              
              <a href={`tel:${phone}`} className="group">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md px-10 py-5 text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 rounded-2xl shadow-xl hover:shadow-white/10"
                >
                  <Phone className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Call Now
                </Button>
              </a>
            </div>

            {/* Ultra-Modern Trust Indicators - Lone Star Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Rating Card */}
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{animationDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                <p className="text-white/95 font-bold text-lg">5.0 Rating</p>
                <p className="text-white/70 text-sm font-medium">200+ Reviews</p>
                <div className="mt-3 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60" />
              </div>
              
              {/* Equipment Card */}
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <WashingMachine className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white/95 font-bold text-lg">Modern Equipment</p>
                <p className="text-white/70 text-sm font-medium">State-of-the-art</p>
                <div className="mt-3 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-60" />
              </div>
              
              {/* Service Card */}
              <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-white/95 font-bold text-lg">Pickup & Delivery</p>
                <p className="text-white/70 text-sm font-medium">Convenient service</p>
                <div className="mt-3 w-full h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full opacity-60" />
              </div>
            </div>
          </div>

          {/* Ultra-Modern Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
              </div>
              <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors duration-300 animate-bounce" />
              <span className="text-white/50 text-xs font-medium tracking-wider">SCROLL</span>
            </div>
          </div>
        </section>

        {/* Ultra-Modern Why Choose Us Section - Dark Lone Star Theme */}
        <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          {/* Background Elements - Lone Star Colors */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full blur-3xl animate-float delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-white/10 to-slate-300/10 rounded-full blur-3xl animate-pulse-glow" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-semibold tracking-wide">Why Choose Us</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Lone Star
                </span>
                ?
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                We're not just another laundromat. We're your{' '}
                <span className="text-blue-400 font-semibold">laundry solution</span> with{' '}
                <span className="text-white font-semibold">cutting-edge technology</span> and{' '}
                <span className="text-red-400 font-semibold">exceptional service</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Modern Equipment Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <WashingMachine className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Modern Equipment</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    State-of-the-art washers and dryers with advanced cleaning technology for superior results.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60" />
                </div>
              </div>

              {/* Pickup & Delivery Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Pickup & Delivery</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    Convenient pickup and delivery service. We come to you, so you don't have to come to us.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-60" />
                </div>
              </div>

              {/* 5-Star Service Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">5-Star Service</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    Consistently rated 5 stars by our customers. Your satisfaction is our top priority.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-60" />
                </div>
              </div>

              {/* Premium Care Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white to-slate-300 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Sparkles className="w-10 h-10 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Premium Care</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    Professional folding, quality detergents, and attention to detail in every load.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-white to-slate-300 rounded-full opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Dark Lone Star Theme */}
        <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-3xl animate-float delay-1000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-semibold tracking-wide">Pricing</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
                Simple,{' '}
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Transparent
                </span>{' '}
                Pricing
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                No hidden fees, no surprises. Just clean clothes at great prices with{' '}
                <span className="text-white font-semibold">complete transparency</span>.
              </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Self Service Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <WashingMachine className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Self Service</h3>
                    <div className="text-4xl font-bold text-white mb-2">$2.50</div>
                    <p className="text-white/80">per load</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Washers: $2.50 - $7.00</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Dryers: $0.25 per 7 minutes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Detergent available</span>
                    </li>
                  </ul>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full opacity-60" />
                </div>
              </div>
            
              {/* Most Popular Wash & Fold Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
                <div className="bg-gradient-to-br from-red-600 via-slate-700 to-blue-600 rounded-3xl p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Wash & Fold</h3>
                    <div className="text-4xl font-bold text-white mb-2">$1.35</div>
                    <p className="text-white/80">per pound</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">Same-day service available</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">Professional folding</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">15lb minimum</span>
                    </li>
                  </ul>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full opacity-60" />
                </div>
              </div>
            
              {/* Pick Up & Delivery Card - Lone Star Colors */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <Truck className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Pick Up & Delivery</h3>
                    <div className="text-4xl font-bold text-white mb-2">$2.00</div>
                    <p className="text-white/80">per pound</p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Fast and friendly service</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Professional wash & fold service</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/80">Same-day delivery available</span>
                    </li>
                  </ul>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section - Dark Lone Star Theme */}
        <section id="services" className="py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-slate-300/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl animate-float delay-1000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-semibold tracking-wide">Services</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Services
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Everything you need for a{' '}
                <span className="text-white font-semibold">complete laundry experience</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Professional Wash & Fold Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Professional Wash & Fold</h3>
                  <p className="text-white/80 leading-relaxed font-medium text-center">
                    Premium service with All Free & Clear, Downy April Fresh, Clorox Whites, and Bounce dryer sheets, packed neatly in plastic bags.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-60" />
                </div>
              </div>

              {/* Large Capacity Machines Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <WashingMachine className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Large Capacity Machines</h3>
                  <p className="text-white/80 leading-relaxed font-medium text-center">
                    Oversized washers perfect for bedding, comforters, and bulky items. 100% machine operation rate.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60" />
                </div>
              </div>

              {/* Convenience Amenities Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white to-slate-300 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-3 border border-white/20">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                    <Sparkles className="w-10 h-10 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white text-center">Convenience Amenities</h3>
                  <p className="text-white/80 leading-relaxed font-medium text-center">
                    Credit Card, Apple Pay and Google Pay acceptance, Free WiFi, LCDs, Soap Shop, Music, & Vending Machines with plenty of parking.
                  </p>
                  <div className="mt-6 w-full h-1 bg-gradient-to-r from-white to-slate-300 rounded-full opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section - Dark Lone Star Theme */}
        <section id="reviews" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl animate-float delay-1000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-semibold tracking-wide">Locations</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Locations
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Three convenient locations serving the DFW metroplex with{' '}
                <span className="text-white font-semibold">premium laundry services</span>.
              </p>
              {useFallback && (
                <p className="text-sm text-white/60 mt-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 inline-block">
                  Showing sample reviews (API temporarily unavailable)
                </p>
              )}
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Lewisville Location & Reviews - Dark Lone Star Theme */}
            <div className="group">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                  <div className="relative text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Lewisville, TX
                    </h3>
                    <div className="text-blue-400 font-semibold text-lg">Open Daily {site.hoursLewisville}</div>
                    <div className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60" />
                  </div>
                </div>
                
                {isLoadingReviews ? (
                  // Loading state - Dark Lone Star Theme
                  <>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse">
                      <div className="h-20 bg-white/20 rounded mb-3"></div>
                      <div className="h-16 bg-white/20 rounded"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse">
                      <div className="h-20 bg-white/20 rounded mb-3"></div>
                      <div className="h-16 bg-white/20 rounded"></div>
                    </div>
                  </>
                ) : useFallback ? (
                  // Fallback hard-coded reviews - Dark Lone Star Theme
                  <>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current w-5 h-5" />
                        ))}
                      </div>
                      <Quote className="text-blue-400 mb-3 w-6 h-6" />
                      <p className="text-white/90 mb-4 leading-relaxed">"Best laundromat in Lewisville! The machines are always clean and working perfectly. Staff is super friendly and helpful."</p>
                      <p className="text-sm font-semibold text-white">- Sarah M., Google Review</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current w-5 h-5" />
                        ))}
                      </div>
                      <Quote className="text-blue-400 mb-3 w-6 h-6" />
                      <p className="text-white/90 mb-4 leading-relaxed">"Fast service and great prices. Love the wash & fold option when I'm too busy. Highly recommend!"</p>
                      <p className="text-sm font-semibold text-white">- Mike R., Yelp Review</p>
                    </div>
                  </>
                ) : (
                  // Real API reviews
                  reviews
                    .filter(loc => loc.location === 'Lewisville, TX')
                    .flatMap(loc => loc.reviews)
                    .slice(0, 2)
                    .map((review, index) => {
                      const reviewId = `lewisville-${index}`;
                      const isExpanded = expandedReviews.has(reviewId);
                      const isLong = isLongReview(review.text);
                      const summary = generateSummary(review.text, 'Lewisville, TX', index);
                      
                      return (
                        <div key={index} className="bg-secondary rounded-xl p-6 shadow-soft min-h-80 flex flex-col">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="text-gray-300" size={16} aria-hidden="true" />
                            ))}
                          </div>
                          
                          {/* Summary */}
                          <div className="bg-accent/10 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-accent">"{summary}"</p>
                          </div>
                          
                          <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                          
                          {/* Review Text Container */}
                          <div className="flex-1 flex flex-col">
                            <div className="text-sm text-muted-foreground mb-3 flex-1">
                              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
                                <p>"{review.text}"</p>
                              </div>
                            </div>
                            
                            {/* Expand/Collapse Button */}
                            {isLong && (
                              <button
                                onClick={() => toggleReviewExpansion(reviewId)}
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-all duration-200 hover:scale-105 mb-3 self-start"
                              >
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                  <ChevronDown size={14} />
                                </div>
                                <span className="transition-colors duration-200">
                                  {isExpanded ? 'Show Less' : 'Read Full Review'}
                                </span>
                              </button>
                            )}
                            
                            <p className="text-xs font-medium">- {review.author_name}, Google Review</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
            
            {/* Farmers Branch Location & Reviews */}
            <div className="group">
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    Farmers Branch, TX
                  </h3>
                  <div className="text-green-600 font-semibold">Open Daily {site.hoursFarmersBranch}</div>
                </div>
                
                {isLoadingReviews ? (
                  // Loading state
                  <>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft animate-pulse">
                      <div className="h-20 bg-muted rounded mb-3"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft animate-pulse">
                      <div className="h-20 bg-muted rounded mb-3"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </>
                ) : useFallback ? (
                  // Fallback hard-coded reviews
                  <>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                      <p className="text-sm text-muted-foreground mb-3">"Family-friendly environment with modern amenities. My kids love watching the machines while I do laundry."</p>
                      <p className="text-xs font-medium">- Jennifer L., Google Review</p>
                    </div>
                    
                    <div className="bg-secondary rounded-xl p-6 shadow-soft">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                      <p className="text-sm text-muted-foreground mb-3">"Excellent customer service and very clean facility. The staff goes above and beyond to help customers."</p>
                      <p className="text-xs font-medium">- David K., Yelp Review</p>
                    </div>
                  </>
                ) : (
                  // Real API reviews
                  reviews
                    .filter(loc => loc.location === 'Farmers Branch, TX')
                    .flatMap(loc => loc.reviews)
                    .slice(0, 2)
                    .map((review, index) => {
                      const reviewId = `farmers-branch-${index}`;
                      const isExpanded = expandedReviews.has(reviewId);
                      const isLong = isLongReview(review.text);
                      const summary = generateSummary(review.text, 'Farmers Branch, TX', index);
                      
                      return (
                        <div key={index} className="bg-secondary rounded-xl p-6 shadow-soft min-h-80 flex flex-col">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="text-gray-300" size={16} aria-hidden="true" />
                            ))}
                          </div>
                          
                          {/* Summary */}
                          <div className="bg-accent/10 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-accent">"{summary}"</p>
                          </div>
                          
                          <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                          
                          {/* Review Text Container */}
                          <div className="flex-1 flex flex-col">
                            <div className="text-sm text-muted-foreground mb-3 flex-1">
                              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
                                <p>"{review.text}"</p>
                              </div>
                            </div>
                            
                            {/* Expand/Collapse Button */}
                            {isLong && (
                              <button
                                onClick={() => toggleReviewExpansion(reviewId)}
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-all duration-200 hover:scale-105 mb-3 self-start"
                              >
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                  <ChevronDown size={14} />
                                </div>
                                <span className="transition-colors duration-200">
                                  {isExpanded ? 'Show Less' : 'Read Full Review'}
                                </span>
                              </button>
                            )}
                            
                            <p className="text-xs font-medium">- {review.author_name}, Google Review</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
            
            {/* Hurst Location & Reviews */}
            <div className="group">
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    Hurst, TX
                  </h3>
                  <div className="text-purple-600 font-semibold">Open Daily {site.hoursHurst}</div>
                </div>
                
                {isLoadingReviews ? (
                  // Loading state
                  <>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft animate-pulse">
                      <div className="h-20 bg-muted rounded mb-3"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft animate-pulse">
                      <div className="h-20 bg-muted rounded mb-3"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </>
                ) : useFallback ? (
                  // Fallback hard-coded reviews
                  <>
                    <div className="bg-secondary rounded-xl p-6 shadow-soft">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                      <p className="text-sm text-muted-foreground mb-3">"Convenient location with express services. Perfect for when I need laundry done quickly. Great quality every time!"</p>
                      <p className="text-xs font-medium">- Amanda T., Google Review</p>
                    </div>
                    
                    <div className="bg-secondary rounded-xl p-6 shadow-soft">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                      <p className="text-sm text-muted-foreground mb-3">"Fast, efficient, and always clean. The staff is professional and the machines are top-notch. Best in Hurst!"</p>
                      <p className="text-xs font-medium">- Robert W., Yelp Review</p>
                    </div>
                  </>
                ) : (
                  // Real API reviews
                  reviews
                    .filter(loc => loc.location === 'Hurst, TX')
                    .flatMap(loc => loc.reviews)
                    .slice(0, 2)
                    .map((review, index) => {
                      const reviewId = `hurst-${index}`;
                      const isExpanded = expandedReviews.has(reviewId);
                      const isLong = isLongReview(review.text);
                      const summary = generateSummary(review.text, 'Hurst, TX', index);
                      
                      return (
                        <div key={index} className="bg-secondary rounded-xl p-6 shadow-soft min-h-80 flex flex-col">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="text-gray-300" size={16} aria-hidden="true" />
                            ))}
                          </div>
                          
                          {/* Summary */}
                          <div className="bg-accent/10 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-accent">"{summary}"</p>
                          </div>
                          
                          <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                          
                          {/* Review Text Container */}
                          <div className="flex-1 flex flex-col">
                            <div className="text-sm text-muted-foreground mb-3 flex-1">
                              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-20'}`}>
                                <p>"{review.text}"</p>
                              </div>
                            </div>
                            
                            {/* Expand/Collapse Button */}
                            {isLong && (
                              <button
                                onClick={() => toggleReviewExpansion(reviewId)}
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-all duration-200 hover:scale-105 mb-3 self-start"
                              >
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                  <ChevronDown size={14} />
                                </div>
                                <span className="transition-colors duration-200">
                                  {isExpanded ? 'Show Less' : 'Read Full Review'}
                                </span>
                              </button>
                            )}
                            
                            <p className="text-xs font-medium">- {review.author_name}, Google Review</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map & contact strip */}
        <section id="contact" className="bg-card/50 py-12 scroll-mt-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 font-serif">Visit us</h2>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-soft flex justify-center mb-8">
              <iframe
                title="Map to Lone Star Wash and Dry"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-96 border-0"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={`tel:${phone}`}>
                <Button className="transition-all duration-200 hover:scale-102 hover:shadow-lg hover:rotate-1">
                  <Phone className="mr-2" aria-hidden="true" />Call
                </Button>
              </a>
              <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="transition-all duration-200 hover:scale-102 hover:shadow-lg hover:-rotate-1">
                  <MapPin className="mr-2" aria-hidden="true" />Directions
                </Button>
              </a>
              <a href="/book-pickup">
                <Button variant="accent" className="transition-all duration-200 hover:scale-102 hover:shadow-lg hover:rotate-1">
                  <Truck className="mr-2" aria-hidden="true" />Book Pickup
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 font-serif">About Us</h2>
            <div className="grid md:grid-cols-2 gap-10 text-left">
              <div>
                <h3 className="text-xl font-semibold mb-3 font-serif">Our Story</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Founded with a commitment to providing the highest quality laundry services in the DFW metroplex, 
                  Lone Star Wash & Dry has been serving our community with dedication and excellence. We understand 
                  that clean clothes are essential to daily life, and we take pride in delivering professional results 
                  every time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 font-serif">Our Commitment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain the cleanest facilities, use the most advanced equipment, and provide exceptional 
                  customer service. Our team is committed to making your laundry experience convenient, efficient, 
                  and enjoyable. Whether you choose self-service or our full wash & fold service, you can trust 
                  us to care for your clothes as if they were our own.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-3xl animate-float delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent">
                  Lone Star
                </span>{' '}
                Wash & Dry
              </h3>
              <p className="text-white/80 leading-relaxed text-lg">
                Your trusted partner for premium laundry services across the DFW metroplex. 
                <span className="text-white font-semibold"> Fast, fresh, and clean</span> every time.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/book-pickup" className="text-white/80 hover:text-white transition-colors text-lg font-medium">Book Pickup</a></li>
                <li><a href="#pricing" className="text-white/80 hover:text-white transition-colors text-lg font-medium">Pricing</a></li>
                <li><a href="#services" className="text-white/80 hover:text-white transition-colors text-lg font-medium">Services</a></li>
                <li><a href="#reviews" className="text-white/80 hover:text-white transition-colors text-lg font-medium">Locations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Contact Info</h4>
              <div className="space-y-4 text-white/80">
                <p className="flex items-center gap-3 text-lg">
                  <Phone className="w-5 h-5 text-red-400" />
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors font-medium">{phone}</a>
                </p>
                <p className="flex items-center gap-3 text-lg">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{address}</span>
                </p>
                <p className="flex items-center gap-3 text-lg">
                  <Truck className="w-5 h-5 text-white" />
                  <span className="font-medium">Pickup & Delivery Available</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-lg">
              © {new Date().getFullYear()} {site.name} — DFW, TX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default Index;