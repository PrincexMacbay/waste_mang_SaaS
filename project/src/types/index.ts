export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  area: string;
  street: string;
  houseType: string;
  flats?: number;
  occupants?: number;
  monthlyFee: number;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  status: 'active' | 'inactive';
  startDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'card' | 'transfer' | 'ussd' | 'usdt';
  status: 'paid' | 'pending' | 'failed';
  invoiceId: string;
  date: string;
}

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'resolved' | 'unresolved' | 'in-progress';
  description: string;
  assignedTo?: string;
  date: string;
  resolvedAt?: string;
}

export interface Route {
  id: string;
  name: string;
  streets: string[];
  zones: string[];
  days: string[];
  truckAssigned?: string;
  status: 'active' | 'inactive';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipients: string;
  type: 'general' | 'payment' | 'emergency';
  status: 'sent' | 'scheduled' | 'draft';
  date: string;
  scheduledFor?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: number;
  netProfit: number;
  pendingComplaints: number;
  notificationsSent: number;
}