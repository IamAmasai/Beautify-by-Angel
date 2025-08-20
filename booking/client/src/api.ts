import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4001';

export const api = {
  async getServices() { 
    const { data } = await axios.get(`${API}/services`); 
    return data as Array<{id: string; name: string; description: string; effectivePrice: number; durationMin: number; category: string;}>;
  },
  
  async getAvailableSlots(date: string) {
    const { data } = await axios.get(`${API}/bookings/slots?date=${date}`);
    return data as string[];
  },
  
  async createBooking(booking: {
    serviceId: string;
    dateTimeISO: string;
    name: string;
    phone: string;
    email: string;
    notes?: string;
    paymentOption: 'deposit' | 'full';
    policyAgreed: boolean;
  }) {
    const { data } = await axios.post(`${API}/bookings`, booking);
    return data as { bookingId: string; chargeAmount: number; total: number; deposit: number; };
  },
  
  async initiatePayment(payment: { bookingId: string; phone: string; amount: number; }) {
    const { data } = await axios.post(`${API}/payments/mpesa`, payment);
    return data as { ok: boolean; mpesa: any; };
  },
  
  async login(credentials: { email: string; password: string; }) {
    const { data } = await axios.post(`${API}/auth/login`, credentials);
    return data as { token: string; };
  },
  
  async getBookings(token: string) {
    const { data } = await axios.get(`${API}/bookings`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    return data as Array<{
      id: string;
      service: { name: string; };
      date: string;
      name: string;
      phone: string;
      email: string;
      totalKsh: number;
      depositKsh: number;
      paidKsh: number;
      paymentOption: string;
      status: string;
      payment?: { status: string; receipt?: string; };
    }>;
  },
  
  async updateBookingStatus(id: string, status: string, token: string) {
    const { data } = await axios.put(`${API}/bookings/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },
  
  async getAvailabilityRules() {
    const { data } = await axios.get(`${API}/availability/rules`);
    return data as Array<{ id: string; weekday: number; startTime: string; endTime: string; active: boolean; }>;
  },
  
  async updateAvailabilityRule(weekday: number, rule: { startTime: string; endTime: string; active: boolean; }, token: string) {
    const { data } = await axios.put(`${API}/availability/rules/${weekday}`, rule, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};