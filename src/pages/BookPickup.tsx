import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, MapPin, CheckCircle, AlertCircle, Loader2, User, Calendar, Clock } from "lucide-react";
import site from "@/content/site.json";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../hooks/useAuth";

// Enhanced validation schema with updated business rules
const schema = z.object({
  full_name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  email: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  // service_type removed - only offering Wash & Fold
  pickup_date: z.string()
    .min(1, "Please select a pickup date"),
  pickup_time: z.string()
    .min(1, "Please select a pickup time"),
  pickup_address: z.string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),
  special_instructions: z.string()
    .max(500, "Special instructions must be less than 500 characters")
    .optional(),
}).refine((data) => {
  // Validate 12-hour advance booking requirement with next-day exception after 6 PM
  // Convert 12-hour format to 24-hour format for date parsing
  const convertTo24Hour = (time12h: string) => {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hours24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  const selectedDateTime = new Date(`${data.pickup_date}T${convertTo24Hour(data.pickup_time)}:00`);
  const now = new Date();
  const currentHour = now.getHours();
  
  let minimumBookingTime;
  
  // If it's after 6 PM, allow next-day bookings
  if (currentHour >= 18) {
    // Allow booking for next day
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    minimumBookingTime = tomorrow;
  } else {
    // Otherwise, require 12 hours advance notice
    minimumBookingTime = new Date(now.getTime() + (12 * 60 * 60 * 1000));
  }
  
  // Check if pickup is at least the minimum time in the future
  if (selectedDateTime < minimumBookingTime) {
    return false;
  }
  
  return true;
}, {
  message: "Bookings must be made at least 12 hours in advance, or next day if after 6 PM",
  path: ["pickup_date"]
}).refine((data) => {
  // Validate business hours (9 AM to 6 PM) - using 12-hour format
  const timeMap: { [key: string]: number } = {
    "9:00 AM": 9, "9:15 AM": 9.25, "9:30 AM": 9.5, "9:45 AM": 9.75,
    "10:00 AM": 10, "10:15 AM": 10.25, "10:30 AM": 10.5, "10:45 AM": 10.75,
    "11:00 AM": 11, "11:15 AM": 11.25, "11:30 AM": 11.5, "11:45 AM": 11.75,
    "12:00 PM": 12, "12:15 PM": 12.25, "12:30 PM": 12.5, "12:45 PM": 12.75,
    "1:00 PM": 13, "1:15 PM": 13.25, "1:30 PM": 13.5, "1:45 PM": 13.75,
    "2:00 PM": 14, "2:15 PM": 14.25, "2:30 PM": 14.5, "2:45 PM": 14.75,
    "3:00 PM": 15, "3:15 PM": 15.25, "3:30 PM": 15.5, "3:45 PM": 15.75,
    "4:00 PM": 16, "4:15 PM": 16.25, "4:30 PM": 16.5, "4:45 PM": 16.75,
    "5:00 PM": 17, "5:15 PM": 17.25, "5:30 PM": 17.5, "5:45 PM": 17.75,
    "6:00 PM": 18
  };
  
  const selectedHour = timeMap[data.pickup_time];
  // Business hours: 9 AM to 6 PM
  return selectedHour >= 9 && selectedHour <= 18;
}, {
  message: "Pickup time must be during business hours (9 AM - 6 PM)",
  path: ["pickup_time"]
}).refine((data) => {
  // Additional validation: if booking is on the minimum allowed date, ensure time is valid
  // Convert 12-hour format to 24-hour format for date parsing
  const convertTo24Hour = (time12h: string) => {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hours24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  const selectedDateTime = new Date(`${data.pickup_date}T${convertTo24Hour(data.pickup_time)}:00`);
  const now = new Date();
  const currentHour = now.getHours();
  
  let minimumBookingTime;
  
  // If it's after 6 PM, allow next-day bookings
  if (currentHour >= 18) {
    // Allow booking for next day
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    minimumBookingTime = tomorrow;
  } else {
    // Otherwise, require 12 hours advance notice
    minimumBookingTime = new Date(now.getTime() + (12 * 60 * 60 * 1000));
  }
  
  // If the selected date is the minimum allowed date, check if time is valid
  const selectedDate = new Date(data.pickup_date);
  const minimumDate = new Date(minimumBookingTime.toISOString().split('T')[0]);
  
  if (selectedDate.getTime() === minimumDate.getTime()) {
    // Same date as minimum allowed, check if time is at least the minimum time from current time
    return selectedDateTime >= minimumBookingTime;
  }
  
  return true;
}, {
  message: "For same-day bookings, pickup time must be at least 12 hours from now",
  path: ["pickup_time"]
});

type FormValues = z.infer<typeof schema>;

const BookPickup = () => {
  const { user } = useAuth(); // Keep for potential future use but don't require it
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastBooking, setLastBooking] = useState<any>(null);
  // Generate 15-minute increment times from 9:00 AM to 6:00 PM in 12-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
        
        let displayHour = hour;
        let period = 'AM';
        
        if (hour === 0) {
          displayHour = 12;
        } else if (hour === 12) {
          period = 'PM';
        } else if (hour > 12) {
          displayHour = hour - 12;
          period = 'PM';
        }
        
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        times.push(timeString);
      }
    }
    return times;
  };
  
  const [availableTimes] = useState(generateTimeOptions());

  useEffect(() => {
    document.title = "Book Pickup and Delivery | Lone Star Wash & Dry";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
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
      // Validation is now handled by the schema
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
            service_type: "Wash & Fold", // Fixed service type
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
        description: `We'll contact you shortly to confirm your Wash & Fold pickup on ${values.pickup_date} at ${values.pickup_time}.`,
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

  // Get minimum date (12 hours from now, or next day if after 6 PM)
  const now = new Date();
  const currentHour = now.getHours();
  
  let minimumBookingTime;
  
  // If it's after 6 PM, allow next-day bookings
  if (currentHour >= 18) {
    // Allow booking for next day
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    minimumBookingTime = tomorrow;
  } else {
    // Otherwise, require 12 hours advance notice
    minimumBookingTime = new Date(now.getTime() + (12 * 60 * 60 * 1000));
  }
  
  const minDate = minimumBookingTime.toISOString().split('T')[0];

  return (
    <div>
      <main className="container mx-auto pb-16 grid gap-8 md:grid-cols-5 px-4">
        <article className="md:col-span-3 rounded-2xl bg-card shadow-soft p-6">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif">Book Pickup and Delivery</h1>
            <p className="text-muted-foreground mt-1">Fast, friendly service across DFW.</p>
            
            {/* Enhanced validation info box */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Booking Guidelines</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Advance booking required: minimum 12 hours notice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Pickup hours: 9:00 AM - 6:00 PM, Monday-Saturday</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      <span>Minimum 15lb for Wash & Fold service</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="(555) 555-5555" 
                          {...field} 
                          className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && !fieldState.error && field.value.length >= 10 && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Valid phone number format
                        </p>
                      )}
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

              <FormField
                name="pickup_date"
                control={form.control}
                                  render={({ field, fieldState }) => {
                    const selectedDate = field.value ? new Date(field.value) : null;
                    const isSunday = selectedDate && selectedDate.getDay() === 0;
                    const isPast = selectedDate && selectedDate < new Date();
                    const now = new Date();
                    const currentHour = now.getHours();
                    
                    let minimumBookingTime;
                    if (currentHour >= 18) {
                      const tomorrow = new Date(now);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(0, 0, 0, 0);
                      minimumBookingTime = tomorrow;
                    } else {
                      minimumBookingTime = new Date(now.getTime() + (12 * 60 * 60 * 1000));
                    }
                    
                    const isWithinMinimumTime = selectedDate && selectedDate < minimumBookingTime;
                  
                  return (
                    <FormItem>
                      <FormLabel>Pickup Date *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          min={minDate}
                          className={fieldState.error ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                                              {field.value && !fieldState.error && !isSunday && !isPast && !isWithinMinimumTime && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Valid pickup date (12+ hours advance)
                          </p>
                        )}
                        {isSunday && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Sorry, we don't offer pickups on Sundays
                          </p>
                        )}
                        {isWithinMinimumTime && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Bookings require 12 hours advance notice (or next day if after 6 PM)
                          </p>
                        )}
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="pickup_time"
                control={form.control}
                render={({ field }) => {
                  const [selectedHour, setSelectedHour] = useState<number>(9);
                  const [selectedMinute, setSelectedMinute] = useState<number>(0);
                  const [isAM, setIsAM] = useState(true);
                  const [showHourDropdown, setShowHourDropdown] = useState(false);
                  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);

                  // Parse current value if it exists
                  React.useEffect(() => {
                    if (field.value) {
                      const [time, period] = field.value.split(' ');
                      const [hours, minutes] = time.split(':').map(Number);
                      setSelectedHour(hours === 12 ? 12 : hours);
                      setSelectedMinute(minutes);
                      setIsAM(period === 'AM');
                    } else {
                      // Set default time
                      const timeString = `9:00 AM`;
                      field.onChange(timeString);
                    }
                  }, [field.value]);

                  const updateTime = (hour: number, minute: number, am: boolean) => {
                    setSelectedHour(hour);
                    setSelectedMinute(minute);
                    setIsAM(am);
                    
                    const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
                    field.onChange(timeString);
                  };

                  const handleHourClick = () => {
                    setShowHourDropdown(!showHourDropdown);
                    setShowMinuteDropdown(false);
                  };

                  const handleMinuteClick = () => {
                    setShowMinuteDropdown(!showMinuteDropdown);
                    setShowHourDropdown(false);
                  };

                  const handlePeriodClick = () => {
                    const newIsAM = !isAM;
                    
                    // Validate that the current hour is valid for the new period
                    if (newIsAM && (selectedHour < 9 || selectedHour > 11)) {
                      // If switching to AM and current hour is invalid, set to 9 AM
                      updateTime(9, selectedMinute, newIsAM);
                    } else if (!newIsAM && (selectedHour < 1 || selectedHour > 6)) {
                      // If switching to PM and current hour is invalid, set to 1 PM
                      updateTime(1, selectedMinute, newIsAM);
                    } else {
                      updateTime(selectedHour, selectedMinute, newIsAM);
                    }
                    
                    setShowHourDropdown(false);
                    setShowMinuteDropdown(false);
                  };

                  const handleHourSelect = (hour: number) => {
                    // Validate business hours: 9 AM to 6 PM
                    if (isAM && (hour < 9 || hour > 11)) {
                      return; // Invalid AM hour
                    }
                    if (!isAM && (hour < 1 || hour > 6)) {
                      return; // Invalid PM hour
                    }
                    if (isAM && hour === 12) {
                      return; // 12 AM is not valid
                    }
                    
                    updateTime(hour, selectedMinute, isAM);
                    setShowHourDropdown(false);
                  };

                  const handleMinuteSelect = (minute: number) => {
                    updateTime(selectedHour, minute, isAM);
                    setShowMinuteDropdown(false);
                  };

                  // Business hours: 9 AM to 6 PM
                  const hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
                  const minutes = [0, 15, 30, 45];

                  return (
                    <FormItem>
                      <FormLabel>Pickup Time *</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-start relative">
                          <div className="flex items-center space-x-2 w-full">
                            <span 
                              className="cursor-pointer hover:text-accent transition-colors px-3 py-2 rounded-md border border-input bg-background hover:bg-accent/10 relative min-w-[60px] text-center text-sm font-normal"
                              onClick={handleHourClick}
                              title="Click to change hour"
                            >
                              {selectedHour}
                              {showHourDropdown && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[60px]">
                                  <div className="text-xs text-gray-500 px-2 py-1 border-b">Hours</div>
                                  {hours.map((hour) => {
                                    // Check if this hour is valid for current AM/PM selection
                                    const isValidHour = (isAM && hour >= 9 && hour <= 11) || 
                                                       (!isAM && hour >= 1 && hour <= 6);
                                    
                                    return (
                                      <div
                                        key={hour}
                                        className={`px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm text-center border-b border-gray-100 last:border-b-0 transition-colors ${
                                          !isValidHour ? 'opacity-30 cursor-not-allowed text-gray-400' : 'hover:bg-accent/20'
                                        } ${selectedHour === hour ? 'bg-accent text-white font-bold' : ''}`}
                                        onClick={() => isValidHour && handleHourSelect(hour)}
                                      >
                                        {hour}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </span>
                            <span className="text-sm text-muted-foreground">:</span>
                            <span 
                              className="cursor-pointer hover:text-accent transition-colors px-3 py-2 rounded-md border border-input bg-background hover:bg-accent/10 relative min-w-[60px] text-center text-sm font-normal"
                              onClick={handleMinuteClick}
                              title="Click to change minute"
                            >
                              {selectedMinute.toString().padStart(2, '0')}
                              {showMinuteDropdown && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[60px]">
                                  <div className="text-xs text-gray-500 px-2 py-1 border-b">Minutes</div>
                                  {minutes.map((minute) => (
                                    <div
                                      key={minute}
                                      className={`px-3 py-2 hover:bg-accent/20 cursor-pointer text-sm text-center border-b border-gray-100 last:border-b-0 transition-colors ${
                                        selectedMinute === minute ? 'bg-accent text-white font-bold' : ''
                                      }`}
                                      onClick={() => handleMinuteSelect(minute)}
                                    >
                                      {minute.toString().padStart(2, '0')}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </span>
                            <span 
                              className="cursor-pointer hover:text-accent transition-colors px-3 py-2 rounded-md border border-input bg-background hover:bg-accent/10 min-w-[60px] text-center text-sm font-normal"
                              onClick={handlePeriodClick}
                              title="Click to change AM/PM"
                            >
                              {isAM ? 'AM' : 'PM'}
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Selected: {field.value}
                        </p>
                      )}
                    </FormItem>
                  );
                }}
              />

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
                        rows={6} 
                        placeholder="Gate code, access instructions, special requests, or soap preferences..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">Wash & Fold service includes:</p>
                      <ul className="space-y-1">
                        <li>• All liquid free & clear detergent</li>
                        <li>• Downy April Fresh fabric softener</li>
                        <li>• Clorox Whites for white items</li>
                        <li>• Bounce dryer sheets</li>
                      </ul>
                      <p className="mt-2">Specify any special requests or alternative products in your instructions above.</p>
                    </div>
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
