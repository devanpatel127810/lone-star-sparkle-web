import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  serviceType: z.enum(["pickup", "delivery", "both"], { required_error: "Choose a service" }),
  datetime: z.string().min(1, "Please choose date and time"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const BookPickup = () => {
  useEffect(() => {
    document.title = "Book Laundry Pickup | Lone Star Wash & Dry";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceType: "pickup",
      datetime: "",
      address1: "",
      address2: "",
      city: "",
      zip: "",
      notes: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Pickup request:", values);
    toast.success("Request received! We’ll text to confirm shortly.");
  };

  const phone = "[PHONE]";
  const mapQuery = "Lone+Star+Wash+and+Dry+DFW";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Laundry Pickup & Delivery",
    provider: {
      "@type": "LocalBusiness",
      name: "Lone Star Wash and Dry",
      areaServed: "Dallas–Fort Worth",
    },
    areaServed: "Dallas–Fort Worth",
    url: "https://lonestarwashanddry.com/book-pickup",
  };

  return (
    <div>
      <header className="container mx-auto py-6">
        <Reveal>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Book Pickup or Delivery</h1>
            <p className="text-muted-foreground mt-1">Fast, friendly service across DFW.</p>
          </div>
        </Reveal>
      </header>

      <main className="container mx-auto pb-16 grid gap-8 md:grid-cols-5">
        <Reveal className="md:col-span-3">
          <article className="rounded-2xl bg-card shadow-soft p-6 transition-all hover:shadow-elegant">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    name="serviceType"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="delivery">Delivery</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="datetime"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred date & time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4">
                  <FormField
                    name="address1"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField
                      name="city"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Dallas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="address2"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apt, suite (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Unit 5B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="zip"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl>
                            <Input placeholder="75001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (gate code, instructions)</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Any special instructions?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-3">
                  <Button type="submit" size="lg">Submit Request</Button>
                  <a href={`tel:${phone}`} className="text-sm underline inline-flex items-center gap-1"><Phone className="h-4 w-4" />Call instead</a>
                </div>
              </form>
            </Form>
          </article>
        </Reveal>

        <Reveal className="md:col-span-2">
          <aside className="space-y-4">
            <div className="rounded-2xl bg-secondary p-4 shadow-soft hover-scale transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <h2 className="font-semibold mb-1">Prefer to drop by?</h2>
              <p className="text-sm text-muted-foreground mb-3">We’re open daily. See directions below.</p>
              <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Button variant="secondary"><MapPin className="mr-2" />Get Directions</Button>
              </a>
            </div>
            <div className="rounded-xl overflow-hidden shadow-soft">
              <iframe
                title="Map to Lone Star Wash and Dry"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 border-0"
              />
            </div>
          </aside>
        </Reveal>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default BookPickup;
