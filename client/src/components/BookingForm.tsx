import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PolicyModal from "@/components/PolicyModal";

// Define types for service data
interface ServicePackage {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
}

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  expectationsList: string[];
  startingPrice: string;
  duration: string;
  priceImage?: string;
  packages: ServicePackage[];
  galleryImages: string[];
}

// Form validation schema
const bookingSchema = z.object({
  service: z.string({
    required_error: "Please select a service",
  }),
  servicePackage: z.string({
    required_error: "Please select a service package",
  }),
  styleSize: z.string({
    required_error: "Please select a style size",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  phone: z.string()
    .min(10, { message: "Please enter a valid phone number" })
    .max(15, { message: "Please enter a valid phone number" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  location: z.enum(["salon", "home"], {
    required_error: "Please select a service location",
  }),
  additionalLength: z.boolean().default(false),
  // New fields for braids options
  braidSource: z.enum(["own", "salon"]).optional(),
  braidQuantity: z.string().optional(),
  notes: z.string().optional(),
  policyAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the booking policy",
  }),
  priceAcknowledged: z.boolean().refine(val => val === true, {
    message: "You must acknowledge the final price",
  }),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  availableTimes: string[];
  availableDates: string[];
  loadingTimes: boolean;
  onSuccess?: () => void;
}

export default function BookingForm({ availableTimes, availableDates, loadingTimes, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [basePrice, setBasePrice] = useState<string>("0");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showFloatingPrice, setShowFloatingPrice] = useState(false);
  
  // Form setup
  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      servicePackage: "",
      styleSize: "",
      date: undefined,
      time: "",
      name: "",
      phone: "",
      email: "",
      location: "salon",
      additionalLength: false,
      braidSource: "own",
      braidQuantity: "0",
      notes: "",
      policyAgreed: false,
      priceAcknowledged: false,
    },
  });
  
  // Watch for form value changes
  const watchService = form.watch("service");
  const watchPackage = form.watch("servicePackage");
  const watchStyleSize = form.watch("styleSize");
  const watchLocation = form.watch("location");
  const watchAdditionalLength = form.watch("additionalLength");
  const watchBraidSource = form.watch("braidSource");
  const watchBraidQuantity = form.watch("braidQuantity");
  
  // Update selected service when service id changes
  useEffect(() => {
    if (watchService) {
      const service = services.find(s => s.id.toString() === watchService) as Service | undefined;
      setSelectedService(service || null);
      form.setValue("servicePackage", "");
      form.setValue("styleSize", "");
      setSelectedPackage(null);
      setBasePrice("0");
      setTotalPrice(0);
    }
  }, [watchService, form]);
  
  // Update selected package when package name changes
  useEffect(() => {
    if (watchPackage && selectedService) {
      const packageItem = selectedService.packages.find((p: ServicePackage) => p.name === watchPackage);
      setSelectedPackage(packageItem || null);
      form.setValue("styleSize", "");
    }
  }, [watchPackage, selectedService, form]);
  
  // Calculate price
  useEffect(() => {
    if (!selectedPackage || !watchStyleSize) {
      setTotalPrice(0);
      return;
    }
    
    try {
      // Parse size price
      let price = 0;
      
      if (watchStyleSize === "small") {
        price = Number(selectedPackage.price.split("-")[1].replace(/,/g, ""));
      } else if (watchStyleSize === "medium") {
        const range = selectedPackage.price.split("-");
        if (range.length === 2) {
          price = Number(range[0].replace(/,/g, "")) + 
            Math.floor((Number(range[1].replace(/,/g, "")) - Number(range[0].replace(/,/g, ""))) / 2);
        } else {
          price = Number(selectedPackage.price.replace(/,/g, ""));
        }
      } else if (watchStyleSize === "large") {
        price = Number(selectedPackage.price.split("-")[0].replace(/,/g, ""));
      }
      
      // Add home service fee if selected
      if (watchLocation === "home") {
        price += 200;
      }
      
      // Add extra length fee if selected
      if (watchAdditionalLength) {
        price += 100;
      }
      
      // Add braid cost if salon provides braids - 70 KSH per braid
      if (watchService && selectedService && selectedService.title.toLowerCase().includes("braid") && 
          watchBraidSource === "salon" && watchBraidQuantity) {
        const braidQuantity = parseInt(watchBraidQuantity) || 0;
        if (braidQuantity > 0) {
          price += braidQuantity * 70; // 70 KSH per braid
        }
      }
      
      setTotalPrice(price);
      setBasePrice(selectedPackage.price);
    } catch (error) {
      console.error("Error calculating price:", error);
      setTotalPrice(0);
    }
  }, [selectedPackage, watchStyleSize, watchLocation, watchAdditionalLength, watchBraidSource, watchBraidQuantity, watchService, selectedService]);
  
  // Track scroll to show floating price
  useEffect(() => {
    const handleScroll = () => {
      if (totalPrice > 0) {
        setShowFloatingPrice(window.scrollY > 300);
      } else {
        setShowFloatingPrice(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalPrice]);
  
  // Booking submission
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      const bookingData = {
        ...data,
        finalPrice: totalPrice
      };
      return await apiRequest('POST', '/api/bookings', bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful!",
        description: "We've received your booking request. Check your email for confirmation.",
        variant: "default",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: BookingForm) {
    bookingMutation.mutate(data);
  }

  return (
    <>
      {/* Floating price bar that appears when scrolling */}
      {showFloatingPrice && totalPrice > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-primary/20 p-4 flex justify-between items-center z-50">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Total Price:</span>
            <span className="text-lg font-bold text-primary">{totalPrice} KSH</span>
          </div>
          <Button 
            type="button"
            className="w-auto"
            onClick={() => {
              const submitBtn = document.querySelector('button[type="submit"]');
              if (submitBtn) {
                submitBtn.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Service *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedService && (
            <FormField
              control={form.control}
              name="servicePackage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Style *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedService.packages.map((pkg: ServicePackage) => (
                        <SelectItem key={pkg.name} value={pkg.name}>
                          {pkg.name} ({pkg.price} KSH)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {selectedPackage && (
            <FormField
              control={form.control}
              name="styleSize"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Size *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="large" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Large
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Medium
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="small" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Small
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {selectedPackage && watchStyleSize && (
            <>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Service Location *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="salon" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            At salon
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="home" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Home service (+200 KSH)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalLength"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Additional length/extensions (+100 KSH)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Braids options - integrated into the main flow only for braiding services */}
              {selectedService && selectedService.title.toLowerCase().includes("braid") && (
                <>
                  <FormField
                    control={form.control}
                    name="braidSource"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Braids Source *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-md border border-muted hover:bg-muted/5 transition-colors">
                              <FormControl>
                                <RadioGroupItem value="own" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  I'll bring my own braids
                                </FormLabel>
                                <span className="text-xs text-muted-foreground">
                                  You'll need to bring all necessary braids for your style
                                </span>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-md border border-muted hover:bg-muted/5 transition-colors">
                              <FormControl>
                                <RadioGroupItem value="salon" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  Purchase braids from salon
                                </FormLabel>
                                <span className="text-xs text-muted-foreground">
                                  70 KSH per braid, added to your total
                                </span>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {watchBraidSource === "salon" && (
                    <FormField
                      control={form.control}
                      name="braidQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Braids Needed *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="Enter quantity" 
                              {...field} 
                              onChange={(e) => {
                                const value = e.target.value;
                                const numValue = parseInt(value) || 0;
                                field.onChange(numValue > 0 ? value : "0");
                              }}
                            />
                          </FormControl>
                          <div className="text-xs text-muted-foreground mt-1">
                            Specify how many braids you need (@ 70 KSH each)
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
              
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between">
                    <span>Price Summary</span>
                    <span>{totalPrice} KSH</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price ({watchStyleSize} size):</span>
                    <span>{basePrice} KSH</span>
                  </div>
                  {watchLocation === "home" && (
                    <div className="flex justify-between">
                      <span>Home Service Fee:</span>
                      <span>+200 KSH</span>
                    </div>
                  )}
                  {watchAdditionalLength && (
                    <div className="flex justify-between">
                      <span>Additional Length:</span>
                      <span>+100 KSH</span>
                    </div>
                  )}
                  {selectedService && selectedService.title.toLowerCase().includes("braid") && 
                  watchBraidSource === "salon" && watchBraidQuantity && parseInt(watchBraidQuantity) > 0 && (
                    <div className="flex justify-between">
                      <span>Braids ({watchBraidQuantity} @ 70 KSH each):</span>
                      <span>+{parseInt(watchBraidQuantity) * 70} KSH</span>
                    </div>
                  )}
                  <div className="border-t pt-2 font-medium flex justify-between">
                    <span>Total:</span>
                    <span>{totalPrice} KSH</span>
                  </div>
                </CardContent>
              </Card>
              
              <FormField
                control={form.control}
                name="priceAcknowledged"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I acknowledge and agree to the total price of {totalPrice} KSH
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Red confirmation message about booking policy */}
              <div className="text-red-500 text-sm font-medium mt-2">
                Booking confirms acceptance of prices and policy
              </div>
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Date *</FormLabel>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      // Disable dates in the past
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      // Also disable dates that are not available
                      const dateString = date.toISOString().split('T')[0];
                      const isAvailable = availableDates.includes(dateString);
                      
                      return date < today || !isAvailable;
                    }}
                    className="rounded-md border"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Time *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Available times" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingTimes ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : availableTimes.length === 0 ? (
                        <SelectItem value="none" disabled>No times available</SelectItem>
                      ) : (
                        availableTimes.map((time: string) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or notes for your appointment" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="policyAgreed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="policy-agree"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setPolicyModalOpen(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      booking policy
                    </button>{" "}
                    and understand the cancellation terms
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={bookingMutation.isPending || !totalPrice}
          >
            {bookingMutation.isPending ? "Processing..." : "Book Now"}
          </Button>
        </form>
      </Form>
      
      <PolicyModal 
        isOpen={policyModalOpen} 
        onClose={() => setPolicyModalOpen(false)}
        onAccept={() => {
          form.setValue("policyAgreed", true);
          setPolicyModalOpen(false);
        }}
      />
    </>
  );
}
