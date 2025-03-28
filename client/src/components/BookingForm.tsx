import { useState } from "react";
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
import { services } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PolicyModal from "@/components/PolicyModal";

// Form validation schema
const bookingSchema = z.object({
  service: z.string({
    required_error: "Please select a service",
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
  notes: z.string().optional(),
  policyAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the booking policy",
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
  
  // Form setup
  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      date: undefined,
      time: "",
      name: "",
      phone: "",
      email: "",
      notes: "",
      policyAgreed: false,
    },
  });
  
  // Booking submission
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      return await apiRequest('POST', '/api/bookings', data);
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
                      className="text-[var(--color-amber)] hover:underline font-medium"
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
            className="w-full bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90 text-white px-6 py-6 text-lg"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? "Processing..." : "Secure Your Booking"}
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
