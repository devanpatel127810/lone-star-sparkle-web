import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, MapPin, CheckCircle, AlertCircle, Loader2, User } from "lucide-react";
import site from "@/content/site.json";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  service_type: z.enum(["Wash & Fold", "Dry Cleaning", "Pickup Only"], { required_error: "Please select a service type" }),
  pickup_date: z.string().min(1, "Please select a pickup date"),
  pickup_time: z.string().min(1, "Please select a pickup time"),
  pickup_address: z.string().min(10, "Address must be at least 10 characters"),
  special_instructions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const BookPickup = () => {
  const { user } = useAuth(); // Keep for potential future use but don't require it
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [availableTimes] = useState([
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ]);

  useEffect(() => {
    document.title = "Book Laundry Pickup | Lone Star Wash & Dry";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      service_type: "Wash & Fold",
      pickup_date: "",
      pickup_time: "",
      pickup_address: "",
      special_instructions: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    
    try {
      // Validate pickup date is not in the past
      const selectedDate = new Date(values.pickup_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error("Pickup date cannot be in the past");
      }

      // Note: Guest bookings are now allowed

      // Create booking in Supabase bookings table
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user?.id || null, // Allow null for guest bookings
            customer_name: values.full_name,
            customer_phone: values.phone,
            pickup_date: values.pickup_date,
            pickup_time: values.pickup_time,
            service_type: values.service_type,
            customer_address: values.pickup_address,
            special_instructions: values.special_instructions || undefined,
            status: 'pending',
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific Supabase errors
        if (error.code === '23505') {
          throw new Error("A booking with these details already exists. Please check your information.");
        } else if (error.code === '23514') {
          throw new Error("Invalid data provided. Please check all required fields.");
        } else if (error.code === '42P01') {
          throw new Error("Service temporarily unavailable. Please try again later.");
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      // Success!
      setSubmissionStatus('success');
      setLastBooking(booking);
      toast.success("Booking submitted successfully!", {
        description: `We'll contact you shortly to confirm your ${values.service_type} pickup on ${values.pickup_date} at ${values.pickup_time}.`,
        duration: 5000,
      });
      
      form.reset();
      
    } catch (error: any) {
      console.error("Booking error:", error);
      setSubmissionStatus('error');
      
      // Show appropriate error message
      const errorMessage = error.message || "Failed to submit booking. Please try again.";
      toast.error("Booking submission failed", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionStatus('idle');
    setLastBooking(null);
    form.reset();
  };

  const phone = site.phone;
  const mapQuery = site.mapQuery;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Laundry Pickup & Delivery",
    provider: {
      "@type": "LocalBusiness",
      name: site.name,
      areaServed: "Dallas–Fort Worth",
    },
    areaServed: "Dallas–Fort Worth",
    url: `${site.website}book-pickup`,
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <main className="container mx-auto pb-16 grid gap-8 md:grid-cols-5 px-4">
        <article className="md:col-span-3 rounded-2xl bg-card shadow-soft p-6">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif">Book Pickup or Delivery</h1>
            <p className="text-muted-foreground mt-1">Fast, friendly service across DFW.</p>
            
            {/* Removed info box - form is accessible to all users */}
          </div>

          {/* Success State */}
          {submissionStatus === 'success' && lastBooking && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Booking Confirmed!</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p><strong>Service:</strong> {lastBooking.service_type}</p>
                    <p><strong>Pickup Date:</strong> {lastBooking.pickup_date}</p>
                    <p><strong>Pickup Time:</strong> {lastBooking.pickup_time}</p>
                    <p><strong>Reference ID:</strong> {lastBooking.id}</p>
                  </div>
                  <p className="mt-3 text-green-700">
                    We'll contact you shortly to confirm your pickup details. 
                    Please save this reference ID for your records.
                  </p>
                  <Button 
                    onClick={resetForm} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Book Another Pickup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {submissionStatus === 'error' && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Submission Failed</h3>
                  <p className="text-red-800">
                    There was an error submitting your booking. Please try again or contact us if the problem persists.
                  </p>
                  <Button 
                    onClick={resetForm} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {/* Form is now accessible to all users */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  name="full_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name *</FormLabel>
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
                      <FormLabel>Phone *</FormLabel>
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
                  name="service_type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wash & Fold">Wash & Fold</SelectItem>
                            <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                            <SelectItem value="Pickup Only">Pickup Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="pickup_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Date *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          min={today}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  name="pickup_time"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Time *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose pickup time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="pickup_address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Dallas, TX 75001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="special_instructions"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Gate code, access instructions, or special requests..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="transition-all duration-200 hover:scale-102 hover:shadow-lg min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
                <a href={`tel:${phone}`} className="text-sm underline inline-flex items-center gap-1 hover:text-accent transition-colors duration-200">
                  <Phone className="h-4 w-4" aria-hidden="true" />Call instead
                </a>
              </div>
            </form>
          </Form>
        </article>

        <aside className="md:col-span-2 space-y-4">
          <div className="rounded-2xl bg-secondary p-4 shadow-soft">
            <h2 className="font-semibold mb-1 font-serif">Prefer to drop by?</h2>
            <p className="text-sm text-muted-foreground mb-3">Visit one of our convenient locations during our operating hours.</p>
            <div className="mb-3 p-3 bg-accent/5 rounded-lg border-l-4 border-l-accent">
              <p className="text-sm text-accent font-medium mb-1">Three Convenient Locations:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Lewisville - Open Daily {site.hoursLewisville}</li>
                <li>• Farmers Branch - Open Daily {site.hoursFarmersBranch}</li>
                <li>• Hurst - Open Daily {site.hoursHurst}</li>
              </ul>
            </div>
            <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <Button variant="secondary" className="transition-all duration-200 hover:scale-102 hover:shadow-lg">
                <MapPin className="mr-2" aria-hidden="true" />Get Directions
              </Button>
            </a>
          </div>
          <div className="rounded-xl overflow-hidden shadow-soft">
            <iframe
              title="Map to Lone Star Wash and Dry"
              src={`https://maps.google.com/?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 border-0"
            />
          </div>
        </aside>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
};

export default BookPickup;
