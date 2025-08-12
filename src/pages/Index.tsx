import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, Sparkles, Clock, Star, Quote } from "lucide-react";
import heroImg from "@/assets/hero-lone-star.webp";
import { useEffect } from "react";
import site from "@/content/site.json";

const Index = () => {
  useEffect(() => {
    document.title = "Lone Star Wash and Dry | DFW Laundromat";

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
  const hours = site.hours || "6:00 AM - 9:30 PM";
  const mapQuery = site.mapQuery;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    image: "/opengraph.png",
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
        <section className="container mx-auto px-4 py-16">
          <article className="relative overflow-hidden rounded-2xl shadow-elegant transition-all duration-500 hover:shadow-2xl">
            <img
              src={heroImg}
              alt="Clean, modern laundromat with rows of stainless steel washers and dryers in DFW"
              className="w-full h-[54vh] sm:h-[60vh] object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/60 to-accent/60" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-3xl px-6 text-center text-primary-foreground">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3">
                  Fast. Fresh. Clean.
                </h1>
                <p className="text-lg sm:text-xl opacity-95 mb-6">
                  The best laundromat in town.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href={`tel:${phone}`}>
                    <Button size="lg" className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                      <Phone className="mr-2" />Call Now
                    </Button>
                  </a>
                  <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg" className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                      <MapPin className="mr-2" />Get Directions
                    </Button>
                  </a>
                  <a href="/book-pickup">
                    <Button variant="accent" size="lg" className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
                      <Truck className="mr-2" />Book Pickup
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Feature cards */}
        <section id="services" className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">Professional laundry services for every need</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="float-in float-in-delay-1">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-105">
                  <Sparkles className="text-accent transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200">Wash & fold.</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">Full-service laundry with same-day options for busy lives.</p>
                </div>
              </div>
            </div>
            <div className="float-in float-in-delay-2">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-105">
                  <Clock className="text-accent transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200">200+ washers and dryers.</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">High-efficiency, eco‑friendly washers and dryers.</p>
                </div>
              </div>
            </div>
            <div className="float-in float-in-delay-3">
              <div className="rounded-xl bg-secondary p-6 shadow-soft hover-scale transition-all hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col group">
                <div className="h-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/10 group-hover:scale-105">
                  <Clock className="text-accent transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="mt-4 font-semibold text-lg group-hover:text-accent transition-colors duration-200">Soap shop vending machines, music and more...</h3>
                  <p className="text-muted-foreground flex-1 group-hover:text-foreground transition-colors duration-200">Open every day for your convenience in any schedule.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">No hidden fees, just clean clothes at great prices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="float-in float-in-delay-1">
              <div className="rounded-xl bg-secondary p-8 shadow-soft hover-scale transition-all hover:-translate-y-2 hover:shadow-elegant border-2 border-transparent hover:border-accent/20 group">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200">Self Service</h3>
                  <div className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-200">$2.50</div>
                  <p className="text-muted-foreground">per load</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Washers: $2.50 - $6.00
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Dryers: $0.25 per 8 minutes
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Detergent available
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="float-in float-in-delay-2">
              <div className="rounded-xl bg-primary p-8 shadow-elegant hover-scale transition-all hover:-translate-y-2 hover:shadow-elegant border-2 border-accent/30 relative group">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary-foreground group-hover:scale-105 transition-transform duration-200">Wash & Fold</h3>
                  <div className="text-3xl font-bold text-accent-foreground group-hover:scale-110 transition-transform duration-200">$1.25</div>
                  <p className="text-primary-foreground/80">per pound</p>
                </div>
                <ul className="space-y-3 text-sm text-primary-foreground/90">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Same-day service available
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Professional folding
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Free pickup & delivery
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="float-in float-in-delay-3">
              <div className="rounded-xl bg-secondary p-8 shadow-soft hover-scale transition-all hover:-translate-y-2 hover:shadow-elegant border-2 border-transparent hover:border-accent/20 group">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200">Dry Cleaning</h3>
                  <div className="text-3xl font-bold text-accent group-hover:scale-110 transition-transform duration-200">$8.00</div>
                  <p className="text-muted-foreground">per item</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Professional cleaning
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-75">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Next-day service
                  </li>
                  <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200 delay-150">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    Delicate fabric care
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Locations & Customer Reviews</h2>
            <p className="text-lg text-muted-foreground">Three convenient locations serving the DFW metroplex with premium laundry services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Lewisville Location & Reviews */}
            <div className="float-in float-in-delay-1">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <Star className="text-accent" size={20} />
                    Lewisville Location
                    <Star className="text-accent" size={20} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Premium location with the latest equipment</p>
                  <div className="text-sm text-accent font-medium">Open Daily {hours}</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Best laundromat in Lewisville! The machines are always clean and working perfectly. Staff is super friendly and helpful."</p>
                  <p className="text-xs font-medium">- Sarah M., Google Review</p>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Fast service and great prices. Love the wash & fold option when I'm too busy. Highly recommend!"</p>
                  <p className="text-xs font-medium">- Mike R., Yelp Review</p>
                </div>
              </div>
            </div>
            
            {/* Farmers Branch Location & Reviews */}
            <div className="float-in float-in-delay-2">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <Star className="text-accent" size={20} />
                    Farmers Branch Location
                    <Star className="text-accent" size={20} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Family-friendly environment with modern amenities</p>
                  <div className="text-sm text-accent font-medium">Open Daily {hours}</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Family-friendly environment with modern amenities. My kids love watching the machines while I do laundry."</p>
                  <p className="text-xs font-medium">- Jennifer L., Google Review</p>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Excellent customer service and very clean facility. The staff goes above and beyond to help customers."</p>
                  <p className="text-xs font-medium">- David K., Yelp Review</p>
                </div>
              </div>
            </div>
            
            {/* Hurst Location & Reviews */}
            <div className="float-in float-in-delay-3">
              <div className="space-y-4">
                <div className="text-center mb-6 p-4 bg-secondary rounded-xl border-l-4 border-l-accent">
                  <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <Star className="text-accent" size={20} />
                    Hurst Location
                    <Star className="text-accent" size={20} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Convenient location with express services</p>
                  <div className="text-sm text-accent font-medium">Open Daily {hours}</div>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Convenient location with express services. Perfect for when I need laundry done quickly. Great quality every time!"</p>
                  <p className="text-xs font-medium">- Amanda T., Google Review</p>
                </div>
                
                <div className="bg-secondary rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 fill-current" size={16} />
                    ))}
                  </div>
                  <Quote className="text-accent/30 mb-2" size={20} />
                  <p className="text-sm text-muted-foreground mb-3">"Fast, efficient, and always clean. The staff is professional and the machines are top-notch. Best in Hurst!"</p>
                  <p className="text-xs font-medium">- Robert W., Yelp Review</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map & contact strip */}
        <section id="contact" className="bg-card/50 py-12">
          <div className="container mx-auto grid gap-8 md:grid-cols-2 px-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Visit us</h2>
              <p className="text-muted-foreground mb-4">{address} — {hours}</p>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${phone}`}>
                  <Button className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:rotate-1">
                    <Phone className="mr-2" />Call
                  </Button>
                </a>
                <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:-rotate-1">
                    <MapPin className="mr-2" />Directions
                  </Button>
                </a>
                <a href="/book-pickup">
                  <Button variant="accent" className="transition-all duration-200 hover:scale-105 hover:shadow-lg hover:rotate-1">
                    <Truck className="mr-2" />Book Pickup
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-soft">
              <iframe
                title="Map to Lone Star Wash and Dry"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-72 border-0"
              />
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
