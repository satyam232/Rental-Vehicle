import apiClient from '@/lib/api-client';

export interface PaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    [key: string]: any;
  };
}

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export const paymentService = {
  async processPayment(data: PaymentData): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>('/payments/process', data);
    return response.data;
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    const response = await apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
    return response.data;
  },

  async getBookingPayments(bookingId: string): Promise<PaymentResponse[]> {
    const response = await apiClient.get<PaymentResponse[]>(`/payments/booking/${bookingId}`);
    return response.data;
  },

  async refundPayment(paymentId: string): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(`/payments/${paymentId}/refund`);
    return response.data;
  }
};