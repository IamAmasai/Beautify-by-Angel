import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronDown, Plus, X } from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const [viewBookingId, setViewBookingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBlockingTimeDialog, setIsBlockingTimeDialog] = useState(false);
  const [timeToBlock, setTimeToBlock] = useState<string>("");

  // Get all bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['/api/admin/bookings'],
  });
  
  // Get bookings for selected date
  const { data: dateBookings = [], isLoading: loadingDateBookings } = useQuery({
    queryKey: ['/api/admin/bookings/date', selectedDate ? formatDate(selectedDate) : ''],
    enabled: !!selectedDate,
  });
  
  // Get blocked times
  const { data: blockedTimes = [], isLoading: loadingBlockedTimes } = useQuery({
    queryKey: ['/api/admin/blocked-times'],
  });
  
  // Get booking by ID for detailed view
  const { data: bookingDetails, isLoading: loadingBookingDetails } = useQuery({
    queryKey: ['/api/admin/bookings', viewBookingId],
    enabled: viewBookingId !== null,
  });
  
  // Approve booking mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('POST', `/api/admin/bookings/${id}/approve`, {});
    },
    onSuccess: () => {
      toast({
        title: "Booking Approved",
        description: "The booking has been approved successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings/date'] });
      setViewBookingId(null);
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "There was an error approving the booking.",
        variant: "destructive",
      });
    },
  });
  
  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('POST', `/api/admin/bookings/${id}/cancel`, {});
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings/date'] });
      setViewBookingId(null);
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "There was an error cancelling the booking.",
        variant: "destructive",
      });
    },
  });
  
  // Block time mutation
  const blockTimeMutation = useMutation({
    mutationFn: async ({ date, time }: { date: string; time: string }) => {
      return await apiRequest('POST', '/api/admin/block-time', { date, time });
    },
    onSuccess: () => {
      toast({
        title: "Time Blocked",
        description: "The time slot has been blocked successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blocked-times'] });
      setIsBlockingTimeDialog(false);
      setTimeToBlock("");
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "There was an error blocking the time slot.",
        variant: "destructive",
      });
    },
  });
  
  // Unblock time mutation
  const unblockTimeMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/blocked-times/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Time Unblocked",
        description: "The time slot has been unblocked successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blocked-times'] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "There was an error unblocking the time slot.",
        variant: "destructive",
      });
    },
  });
  
  const handleBlockTime = () => {
    if (!selectedDate || !timeToBlock) {
      toast({
        title: "Invalid Input",
        description: "Please select both a date and time to block.",
        variant: "destructive",
      });
      return;
    }
    
    blockTimeMutation.mutate({
      date: formatDate(selectedDate),
      time: timeToBlock,
    });
  };
  
  return (
    <div>
      <Tabs defaultValue="bookings">
        <TabsList className="mb-8">
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="availability">Manage Availability</TabsTrigger>
        </TabsList>
        
        {/* All Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Manage all your upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="w-full h-16" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{booking.serviceName}</TableCell>
                        <TableCell>{booking.clientName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setViewBookingId(booking.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calendar View Tab */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Appointments for {selectedDate ? formatDate(selectedDate) : 'Selected Date'}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingDateBookings ? (
                  <div className="space-y-2">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="w-full h-16" />
                    ))}
                  </div>
                ) : dateBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No bookings for this date</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dateBookings.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>{booking.clientName}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setViewBookingId(booking.id)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Manage Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Manage Your Availability</CardTitle>
                  <CardDescription>Block off times when you're unavailable</CardDescription>
                </div>
                <Button
                  onClick={() => setIsBlockingTimeDialog(true)}
                  className="bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Block Time
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingBlockedTimes ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="w-full h-12" />
                  ))}
                </div>
              ) : blockedTimes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blocked time slots</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedTimes.map((blockedTime: any) => (
                      <TableRow key={blockedTime.id}>
                        <TableCell>{blockedTime.date}</TableCell>
                        <TableCell>{blockedTime.time}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => unblockTimeMutation.mutate(blockedTime.id)}
                            disabled={unblockTimeMutation.isPending}
                          >
                            Unblock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Booking Details Dialog */}
      <Dialog open={viewBookingId !== null} onOpenChange={(open) => !open && setViewBookingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View and manage booking information
            </DialogDescription>
          </DialogHeader>
          
          {loadingBookingDetails ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          ) : bookingDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Service:</div>
                <div>{bookingDetails.serviceName}</div>
                
                <div className="text-sm font-medium">Date:</div>
                <div>{bookingDetails.date}</div>
                
                <div className="text-sm font-medium">Time:</div>
                <div>{bookingDetails.time}</div>
                
                <div className="text-sm font-medium">Client Name:</div>
                <div>{bookingDetails.clientName}</div>
                
                <div className="text-sm font-medium">Phone:</div>
                <div>{bookingDetails.phone}</div>
                
                <div className="text-sm font-medium">Email:</div>
                <div>{bookingDetails.email}</div>
                
                <div className="text-sm font-medium">Status:</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    bookingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    bookingDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bookingDetails.status.charAt(0).toUpperCase() + bookingDetails.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {bookingDetails.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{bookingDetails.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p>No booking details found</p>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {bookingDetails?.status === 'pending' && (
              <Button 
                onClick={() => approveMutation.mutate(viewBookingId!)}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            )}
            
            {(bookingDetails?.status === 'pending' || bookingDetails?.status === 'approved') && (
              <Button
                onClick={() => cancelMutation.mutate(viewBookingId!)}
                disabled={cancelMutation.isPending}
                variant="destructive"
              >
                Cancel
              </Button>
            )}
            
            <Button variant="outline" onClick={() => setViewBookingId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block Time Dialog */}
      <Dialog open={isBlockingTimeDialog} onOpenChange={setIsBlockingTimeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>
              Select a date and time to block off in your schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{selectedDate ? formatDate(selectedDate) : 'Select a date'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {timeToBlock || 'Select a time'}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((time) => (
                    <DropdownMenuItem key={time} onClick={() => setTimeToBlock(time)}>
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleBlockTime}
              disabled={blockTimeMutation.isPending || !selectedDate || !timeToBlock}
              className="bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90"
            >
              {blockTimeMutation.isPending ? 'Blocking...' : 'Block Time'}
            </Button>
            <Button variant="outline" onClick={() => setIsBlockingTimeDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
