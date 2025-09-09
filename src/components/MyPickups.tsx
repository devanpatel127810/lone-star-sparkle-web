import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';
import { emailService, type BookingData } from '../lib/emailService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, Package, MapPin, Phone, Settings, History, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function MyPickups() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Find the booking to get customer email
      const booking = bookings.find(b => b.id === bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        console.error('Error cancelling booking:', error);
        return;
      }

      // Send cancellation email if customer has email
      if (booking && booking.customer_email) {
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
          status: 'cancelled',
          created_at: booking.created_at
        };

        try {
          await emailService.sendStatusUpdate(bookingData, 'cancelled');
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
        }
      }

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    isUpcoming(booking.pickup_date) && 
    booking.status !== 'completed' && 
    booking.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(booking => 
    !isUpcoming(booking.pickup_date) || 
    booking.status === 'completed' || 
    booking.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBookings} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Pickups</h2>
        <p className="text-gray-600">Manage your laundry pickup schedule and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Pickups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingBookings.length === 1 ? 'pickup' : 'pickups'} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {bookings.length === 1 ? 'booking' : 'bookings'} all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              services completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Pickups</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming pickups</h3>
                <p className="text-gray-600 text-center mb-4">
                  You don't have any scheduled pickups. Book a new pickup to get started!
                </p>
                <Button asChild>
                  <a href="/book-pickup">Book New Pickup</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {formatDate(booking.pickup_date)} at {booking.pickup_time}
                        </CardTitle>
                        <CardTitle className="text-sm text-muted-foreground">
                          {booking.service_type} • {booking.full_name}
                        </CardTitle>
                      </div>
                    </div>
                    {booking.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{booking.pickup_address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{booking.phone}</span>
                      </div>
                    </div>
                    {booking.special_instructions && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Special Instructions:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {booking.special_instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking history</h3>
                <p className="text-gray-600 text-center">
                  Your completed and cancelled bookings will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {formatDate(booking.pickup_date)} at {booking.pickup_time}
                        </CardTitle>
                        <CardTitle className="text-sm text-muted-foreground">
                          {booking.service_type} • {booking.full_name}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{booking.pickup_address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{booking.phone}</span>
                      </div>
                    </div>
                    {booking.special_instructions && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Special Instructions:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {booking.special_instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="/book-pickup">Book New Pickup</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/profile">Update Profile</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
