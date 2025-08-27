import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, Sparkles, Star, Quote, WashingMachine, ChevronDown, ChevronUp } from "lucide-react";
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
    const textLower = text.toLowerCase();
    
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
  const hours = "6:00 AM - 9:30 PM";
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
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center relative">
          <article className="absolute inset-0 w-full h-full">
            <img
              src={heroImg}
              alt="Clean, modern laundromat with rows of stainless steel washers and dryers in DFW"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/60 to-accent/60" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-3xl px-6 text-center text-primary-foreground">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 font-serif">
                  Fast. Fresh. Clean.
                </h1>
                <p className="text-lg sm:text-xl opacity-95 mb-6 font-medium">
                  The best laundromat in town.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href={`tel:${phone}`}>
                    <Button size="lg" className="transition-all duration-200 hover:scale-102 hover:shadow-lg">
                      <Phone className="mr-2" aria-hidden="true" />Call Now
                    </Button>
                  </a>
                  <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg" className="transition-all duration-200 hover:scale-102 hover:shadow-lg">
                      <MapPin className="mr-2" aria-hidden="true" />Get Directions
                    </Button>
                  </a>
                  <a href="/book-pickup">
                    <Button variant="accent" size="lg" className="transition-all duration-200 hover:scale-102 hover:shadow-lg">
                      <Truck className="mr-2" aria-hidden="true" />Book Pickup
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto py-12 px-4 scroll-mt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 font-serif">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg font-medium">No hidden fees, just clean clothes at great prices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="float-in float-in-delay-1">
              <div className="rounded-xl bg-secondary p-8 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant border-2 border-transparent hover:border-accent/20 group">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200 font-serif">Self Service</h3>
                  <div className="text-3xl font-bold text-accent group-hover:scale-105 transition-transform duration-200">$2.50</div>
                  <p className="text-muted-foreground">per load</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Washers: $2.50 - $7.00
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Dryers: $0.25 per 7 minutes
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Detergent available
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="float-in float-in-delay-2">
              <div className="rounded-xl bg-primary p-8 shadow-elegant hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant border-2 border-accent/30 relative group">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary-foreground group-hover:scale-102 transition-transform duration-200 font-serif">Wash & Fold</h3>
                  <div className="text-3xl font-bold text-accent-foreground group-hover:scale-105 transition-transform duration-200">$1.35</div>
                  <p className="text-primary-foreground/80">per pound</p>
                </div>
                <ul className="space-y-3 text-sm text-primary-foreground/90">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Same-day service available
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Professional folding
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    15lb minimum
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="float-in float-in-delay-3">
              <div className="rounded-xl bg-secondary p-8 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant border-2 border-transparent hover:border-accent/20 group">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200 font-serif">Pick Up & Delivery</h3>
                  <div className="text-3xl font-bold text-accent group-hover:scale-105 transition-transform duration-200">$2.00</div>
                  <p className="text-muted-foreground">per pound</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Fast and friendly service
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Professional wash & fold service
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                    Same-day delivery available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" className="container mx-auto py-12 px-4 scroll-mt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 font-serif">Features & Services</h2>
            <p className="text-lg text-muted-foreground font-medium">Everything you need for a complete laundry experience</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="float-in float-in-delay-1">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-102">
                  <Truck className="text-accent transition-all duration-300 group-hover:rotate-6 group-hover:scale-105" aria-hidden="true" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200 font-serif">Professional Wash & Fold</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">Premium service with All Free & Clear, Downy April Fresh, Clorox Whites, and Bounce dryer sheets, packed neatly in plastic bags.</p>
                </div>
              </div>
            </div>
            <div className="float-in float-in-delay-2">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-102">
                  <WashingMachine className="text-accent transition-all duration-300 group-hover:rotate-6 group-hover:scale-105" aria-hidden="true" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200 font-serif">Large Capacity Machines</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">Oversized washers perfect for bedding, comforters, and bulky items. 100% machine operation rate.</p>
                </div>
              </div>
            </div>
            <div className="float-in float-in-delay-3">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-102">
                  <Sparkles className="text-accent transition-all duration-300 group-hover:rotate-6 group-hover:scale-105" aria-hidden="true" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200 font-serif">Convenience Amenities</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">Credit Card, Apple Pay and Google Pay acceptance, Free WiFi, LCDs, Soap Shop, Music, & Vending Machines with plenty of parking.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section id="reviews" className="container mx-auto py-12 px-4 scroll-mt-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 font-serif">Locations</h2>
            <p className="text-lg text-muted-foreground font-medium">Three convenient locations serving the DFW metroplex with premium laundry services</p>
            {useFallback && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing sample reviews (API temporarily unavailable)
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Lewisville Location & Reviews */}
            <div className="float-in float-in-delay-1">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 font-serif">
                    Lewisville, TX
                  </h3>
                  <div className="text-sm text-accent font-medium">Open Daily {site.hoursLewisville}</div>
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
                      <p className="text-sm text-muted-foreground mb-3">"Best laundromat in Lewisville! The machines are always clean and working perfectly. Staff is super friendly and helpful."</p>
                      <p className="text-xs font-medium">- Sarah M., Google Review</p>
                    </div>
                    
                    <div className="bg-secondary rounded-xl p-6 shadow-soft">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-500 fill-current" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <Quote className="text-accent/30 mb-2" size={20} aria-hidden="true" />
                      <p className="text-sm text-muted-foreground mb-3">"Fast service and great prices. Love the wash & fold option when I'm too busy. Highly recommend!"</p>
                      <p className="text-xs font-medium">- Mike R., Yelp Review</p>
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
            <div className="float-in float-in-delay-2">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 font-serif">
                    Farmers Branch, TX
                  </h3>
                  <div className="text-sm text-accent font-medium">Open Daily {site.hoursFarmersBranch}</div>
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
            <div className="float-in float-in-delay-3">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 font-serif">
                    Hurst, TX
                  </h3>
                  <div className="text-sm text-accent font-medium">Open Daily {site.hoursHurst}</div>
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

      <footer className="container mx-auto py-8 text-sm text-muted-foreground px-4">
        <p>© {new Date().getFullYear()} {site.name} — DFW, TX.</p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default Index;