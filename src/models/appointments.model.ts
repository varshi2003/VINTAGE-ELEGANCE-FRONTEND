export interface Appointment {
  id?: string;
  state: string;
  city: string;
  outlet: string;
  gender: string;
  services: { name: string; cost: number }[];
  stylists: { name: string }[];
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  totalCost: number;
  paymentStatus?: string;
}
