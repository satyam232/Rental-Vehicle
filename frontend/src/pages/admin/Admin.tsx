import { useEffect, useState } from 'react';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth';
import { vehicleService } from '@/services/vehicle';
import { bookingService } from '@/services/booking';
import { AddVehicleForm } from './AddVehicleForm';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function Admin() {
  const [currentTab, setCurrentTab] = useState('users');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
const [loading, setLoading] = useState(true);
const [users, setUsers] = useState([]);

useEffect(() => {
  const checkAdminAndFetchData = async () => {
    try {
      const adminStatus = await authService.isAdmin();
      setIsAdmin(adminStatus);
      if (adminStatus) {
        const [usersData, vehiclesData, bookingsData] = await Promise.all([
          authService.getAdminUsers(),
          vehicleService.getVehicles(),
          bookingService.getAllBookings()
        ]);
        setUsers(usersData);
        setVehicles(vehiclesData);
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
    } finally {
      setLoading(false);
    }
  };
  checkAdminAndFetchData();
}, []);

if (loading) {
  return <div className="min-h-screen flex flex-col">
    <MainNav />
    <main className="flex-grow pt-24 pb-16 text-center">
      Loading admin permissions...
    </main>
  </div>;
}

if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <MainNav />
        <main className="flex-grow pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold">Unauthorized Access</h1>
          <p className="text-muted-foreground mt-4">
            You don't have permission to view this page.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <Button variant="outline">Export Data</Button>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-4 w-1/2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user._id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="mr-2">Edit</Button>
                           
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>{booking._id}</TableCell>
                          <TableCell>{booking.vehicleId?.name || 'N/A'}</TableCell>
                          <TableCell>{booking.userId?.email || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(booking.startDate).toLocaleDateString()} - 
                            {new Date(booking.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Payment Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Payment data will be populated here */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicles">
              <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle>Vehicle Management</CardTitle>
                  <AddVehicleForm onSuccess={() => window.location.reload()} />
                </CardHeader>
                <CardContent className="p-6">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] px-4 py-3">Vehicle ID</TableHead>
                        <TableHead className="px-4 py-3">Name</TableHead>
                        <TableHead className="px-4 py-3">Type</TableHead>
                        <TableHead className="px-4 py-3 text-right">Price/Day</TableHead>
                        <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="px-4 py-3 font-medium">{vehicle.id}</TableCell>
                          <TableCell className="px-4 py-3">{vehicle?.name || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-3">{vehicle?.type || 'N/A'}</TableCell>
                          <TableCell className="px-4 py-3 text-right">₹{vehicle.price?.toFixed(2)}</TableCell>
                          <TableCell className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" className="mr-2">Edit</Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">Delete</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this vehicle? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                  <Button variant="destructive" onClick={async () => {
                                    try {
                                      await vehicleService.deleteVehicle(vehicle.id);
                                      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
                                      toast({
                                        title: "Success",
                                        description: "Vehicle deleted successfully",
                                      });
                                    } catch (error) {
                                      console.error('Failed to delete vehicle:', error);
                                      toast({
                                        title: "Error",
                                        description: "Failed to delete vehicle",
                                        variant: "destructive"
                                      });
                                    }
                                  }}>Delete</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
