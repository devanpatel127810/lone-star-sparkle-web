import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { emailService, type BookingData } from '../lib/emailService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Mail, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { Booking } from '../types';

interface EmailNotificationsProps {
  isAdmin?: boolean;
}

export default function EmailNotifications({ isAdmin = false }: EmailNotificationsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      console.log('Fetched bookings data:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setSendingEmail(bookingId);
    
    try {
      // Find the booking
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        toast.error('Booking not found');
        return;
      }

      // Update status in database
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        toast.error('Failed to update booking status');
        return;
      }

      // Send status update email if customer has email
      if (booking.customer_email) {
        const bookingData: BookingData = {
          id: booking.id,
          customer_name: booking.customer_name,
          customer_phone: booking.phone,
          customer_email: booking.customer_email,
          pickup_date: booking.pickup_date,
          pickup_time: booking.pickup_time,
          service_type: booking.service_type,
          customer_address: booking.pickup_address,
          special_instructions: booking.special_instructions,
          status: newStatus,
          created_at: booking.created_at
        };

        const emailSent = await emailService.sendStatusUpdate(bookingData, newStatus);
        
        if (emailSent) {
          toast.success(`Status updated to ${newStatus} and email sent to customer`);
        } else {
          toast.success(`Status updated to ${newStatus}, but email failed to send`);
        }
      } else {
        toast.success(`Status updated to ${newStatus} (no email address on file)`);
      }

      // Refresh bookings
      await fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update booking status');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleSendReminder = async (bookingId: string) => {
    setSendingEmail(bookingId);
    
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        toast.error('Booking not found');
        return;
      }

      if (!booking.customer_email) {
        toast.error('No email address on file for this booking');
        return;
      }

      const bookingData: BookingData = {
        id: booking.id,
        customer_name: booking.customer_name,
        customer_phone: booking.phone,
        customer_email: booking.customer_email,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        service_type: booking.service_type,
        customer_address: booking.pickup_address,
        special_instructions: booking.special_instructions,
        status: booking.status,
        created_at: booking.created_at
      };

      const emailSent = await emailService.sendBookingReminder(bookingData);
      
      if (emailSent) {
        toast.success('Reminder email sent successfully');
      } else {
        toast.error('Failed to send reminder email');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reminder email');
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Notifications</h2>
          <p className="text-gray-600">Manage booking status updates and send reminder emails</p>
        </div>
        <Button onClick={fetchBookings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg">{booking.customer_name}</CardTitle>
                    <p className="text-sm text-gray-600">ID: {booking.id.slice(0, 8)}...</p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {booking.customer_email ? (
                    <Mail className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Details</p>
                  <p className="text-sm text-gray-600">{booking.pickup_date} at {booking.pickup_time}</p>
                  <p className="text-sm text-gray-600">{booking.service_type}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-sm text-gray-600">{booking.customer_phone || booking.phone || 'No phone'}</p>
                  {booking.customer_email ? (
                    <p className="text-sm text-gray-600">{booking.customer_email}</p>
                  ) : (
                    <p className="text-sm text-red-500">No email address</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Select
                      value={booking.status}
                      onValueChange={(newStatus) => handleStatusUpdate(booking.id, newStatus)}
                      disabled={sendingEmail === booking.id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isUpcoming(booking.pickup_date) && booking.customer_email && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendReminder(booking.id)}
                      disabled={sendingEmail === booking.id}
                      className="w-full"
                    >
                      {sendingEmail === booking.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">There are no bookings to manage at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
