import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, Sparkles, Clock } from "lucide-react";
import heroImg from "@/assets/hero-lone-star.webp";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Lone Star Wash and Dry | DFW Laundromat";
  }, []);

  const phone = "[PHONE]"; // TODO: replace with real number
  const address = "[ADDRESS]"; // TODO: replace with real address
  const hours = "[HOURS]"; // TODO: replace with real hours by day
  const mapQuery = "Lone+Star+Wash+and+Dry+DFW";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Lone Star Wash and Dry",
    image: "/opengraph.png",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "DFW",
      addressRegion: "TX",
      postalCode: "[ZIP]",
      addressCountry: "US",
    },
    url: "https://lonestarwashanddry.com/",
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
        opens: "07:00",
        closes: "22:00",
      },
    ],
    priceRange: "$$",
    areaServed: "Dallas–Fort Worth",
  };

  return (
    <div>
      <header className="container mx-auto py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold text-xl">
          <Sparkles className="text-accent" />
          <span>Lone Star Wash & Dry</span>
        </a>
        <nav className="hidden sm:flex items-center gap-4">
          <a href="#services" className="text-sm hover:underline">Services</a>
          <a href="#pricing" className="text-sm hover:underline">Pricing</a>
          <a href="#contact" className="text-sm hover:underline">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${phone}`}>
            <Button size="sm" className="hidden sm:inline-flex">Call Now</Button>
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto">
          <article className="relative overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={heroImg}
              alt="Clean, modern laundromat with rows of stainless steel washers and dryers in DFW"
              className="w-full h-[54vh] sm:h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/60 to-accent/60" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-3xl px-6 text-center text-primary-foreground">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3">Fast. Fresh. Clean.</h1>
                <p className="text-lg sm:text-xl opacity-95 mb-6">The best laundromat in town.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href={`tel:${phone}`}>
                    <Button size="lg"><Phone className="mr-2" />Call Now</Button>
                  </a>
                  <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg"><MapPin className="mr-2" />Get Directions</Button>
                  </a>
                  <a href="#contact">
                    <Button variant="accent" size="lg"><Truck className="mr-2" />Book Pickup</Button>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Feature cards */}
        <section id="services" className="container mx-auto py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl bg-secondary p-6 shadow-soft">
              <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="text-accent" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Wash & fold.</h3>
              <p className="text-muted-foreground">Full-service laundry with same-day options for busy lives.</p>
            </div>
            <div className="rounded-xl bg-secondary p-6 shadow-soft">
              <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="text-accent" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Modern machines.</h3>
              <p className="text-muted-foreground">High-efficiency, eco‑friendly washers and dryers.</p>
            </div>
            <div className="rounded-xl bg-secondary p-6 shadow-soft">
              <div className="h-40 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="text-accent" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">24/7 access.</h3>
              <p className="text-muted-foreground">Open every day for your convenience in any schedule.</p>
            </div>
          </div>
        </section>

        {/* Map & contact strip */}
        <section id="contact" className="bg-card/50 py-12">
          <div className="container mx-auto grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-2">Visit us</h2>
              <p className="text-muted-foreground mb-4">{address} — {hours}</p>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${phone}`}><Button><Phone className="mr-2" />Call</Button></a>
                <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary"><MapPin className="mr-2" />Directions</Button>
                </a>
                <a href="#" aria-label="Book pickup (coming soon)"><Button variant="accent"><Truck className="mr-2" />Book Pickup</Button></a>
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

      <footer className="container mx-auto py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Lone Star Wash and Dry — DFW, TX.</p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default Index;
