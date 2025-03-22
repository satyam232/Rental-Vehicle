import apiClient from '@/lib/api-client';
import { authService } from '@/services/auth';

export interface BookingData {
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
}

export interface BookingResponse {
  _id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const bookingService = {
  async createBooking(data: BookingData): Promise<BookingResponse> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');
    try {
      const user = await authService.getCurrentUser();
      console.log('Retrieved user during booking:', user);
      if (!user || !user._id) {
        console.error('Missing user object or ID - auth status:', authService.isAuthenticated(), 'User data:', user);
        throw new Error('User information not found in session');
      }
      const bookingWithUser = { ...data, userId: user._id };
    
      const response = await apiClient.post<BookingResponse>('/bookings', bookingWithUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create booking');
    }
},

  async confirmBooking(bookingId: string): Promise<BookingResponse> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');
    const response = await apiClient.patch<BookingResponse>(`/bookings/${bookingId}/confirm`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getBookings(): Promise<BookingResponse[]> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');
    const response = await apiClient.get<BookingResponse[]>('/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');
    const response = await apiClient.patch<BookingResponse>(`/bookings/${bookingId}/cancel`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};