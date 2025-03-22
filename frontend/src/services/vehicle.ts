import  apiClient  from '@/lib/api-client';
import { authService } from '@/services/auth';

export interface VehicleData {
  id: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  image: string;
  seats: number;
  luggage: number;
  transmission: string;
  fuelType: string;
  rating: number;
  available: boolean;
}

export const vehicleService = {
  async getVehicles(): Promise<VehicleData[]> {
    const response = await apiClient.get<any[]>('/vehicles');
    return response.data.map(vehicle => {
      const { _id, ...rest } = vehicle;
      return { id: _id, ...rest };
    });
  },

  async createVehicle(vehicleData: Omit<VehicleData, 'id'>): Promise<VehicleData> {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Authentication required');
      const response = await apiClient.post('/vehicles', vehicleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { _id, ...rest } = response.data;
      return { id: _id, ...rest };
    } catch (error) {
      throw new Error('Failed to create vehicle');
    }
  },

  async deleteVehicle(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required');
    await apiClient.delete(`/vehicles/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getVehicleById(id: string): Promise<VehicleData> {
    if (!id) {
    //   console.error('Attempted to fetch vehicle with undefined ID');
      throw new Error('Invalid vehicle ID: ' + id);
    }
    console.log('Fetching vehicle with ID:', id);
    const response = await apiClient.get<any>(`/vehicles/${id}`);
    const { _id, ...rest } = response.data;
    return { id: _id, ...rest };
  },

  async checkAvailability(id: string, startDate: string, endDate: string): Promise<boolean> {
    // console.log('Checking availability for vehicle ID:', id);
    // console.log('Date range:', { startDate, endDate });
    const response = await apiClient.get<{ available: boolean }>(`/vehicles/${id}/availability`, {

      params: { startDate, endDate }
    });
    return response.data.available;
  },

  async searchVehicles(params: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    seats?: number;
    available?: boolean;
  }): Promise<VehicleData[]> {
    const response = await apiClient.get<VehicleData[]>('/vehicles/search', { params });
    return response.data;
  }
};