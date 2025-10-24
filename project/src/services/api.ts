import axios, { type AxiosInstance, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from storage
    this.token = localStorage.getItem('access_token');
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  }) {
    return this.client.post<ApiResponse<any>>('/auth/register', data);
  }

  async login(email: string, password: string) {
    return this.client.post<ApiResponse<any>>('/auth/login', {
      email,
      password,
    });
  }

  async verifyToken() {
    return this.client.get<ApiResponse<any>>('/auth/verify-token');
  }

  // Organization endpoints
  async registerManager(data: {
    company_name: string;
    email: string;
    password: string;
    phone: string;
    zone: string;
    first_name: string;
    last_name: string;
    address?: string;
  }) {
    return this.client.post<ApiResponse<any>>('/organizations/register-manager', data);
  }

  async getMyOrganization() {
    return this.client.get<ApiResponse<any>>('/organizations/my-organization');
  }

  async updateOrganization(data: {
    name?: string;
    phone?: string;
    address?: string;
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
  }) {
    return this.client.put<ApiResponse<any>>('/organizations/organization', data);
  }

  async updateOrganizationFeatures(data: {
    enabled_features?: Record<string, boolean>;
    dashboard_layout?: any;
  }) {
    return this.client.put<ApiResponse<any>>('/organizations/organization/features', data);
  }

  // Subscription endpoints
  async getSubscriptionTiers() {
    return this.client.get<ApiResponse<any>>('/subscriptions/tiers');
  }

  async getMySubscription() {
    return this.client.get<ApiResponse<any>>('/subscriptions/my-subscription');
  }

  async upgradeSubscription(tier_id: number) {
    return this.client.post<ApiResponse<any>>('/subscriptions/subscription/upgrade', {
      tier_id,
    });
  }

  async downgradeSubscription(tier_id: number) {
    return this.client.post<ApiResponse<any>>('/subscriptions/subscription/downgrade', {
      tier_id,
    });
  }

  async checkSubscriptionLimits() {
    return this.client.get<ApiResponse<any>>('/subscriptions/subscription/check-limits');
  }

  async getInvoices(page: number = 1, limit: number = 10) {
    return this.client.get<ApiResponse<any>>('/subscriptions/invoices', {
      params: { page, limit },
    });
  }

  async getInvoice(invoice_id: string) {
    return this.client.get<ApiResponse<any>>(`/subscriptions/invoice/${invoice_id}`);
  }

  // Audit logs endpoints
  async getAuditLogs(page: number = 1, limit: number = 50, filters?: any) {
    return this.client.get<ApiResponse<any>>('/audit-logs', {
      params: { page, limit, ...filters },
    });
  }

  async getAuditLogSummary() {
    return this.client.get<ApiResponse<any>>('/audit-logs/summary');
  }

  // Customer endpoints
  async getCustomerProfile() {
    return this.client.get<ApiResponse<any>>('/customers/profile');
  }

  async updateCustomerProfile(data: any) {
    return this.client.put<ApiResponse<any>>('/customers/profile', data);
  }

  async getNotifications() {
    return this.client.get<ApiResponse<any>>('/customers/notifications');
  }

  async markNotificationRead(notification_id: number) {
    return this.client.put<ApiResponse<any>>(
      `/customers/notifications/${notification_id}/read`,
      {}
    );
  }

  // Pickups endpoints
  async getPickups() {
    return this.client.get<ApiResponse<any>>('/pickups/schedule');
  }

  async createPickup(data: { scheduled_date: string; pickup_time: string; notes?: string }) {
    return this.client.post<ApiResponse<any>>('/pickups/schedule', data);
  }

  async getUpcomingPickups() {
    return this.client.get<ApiResponse<any>>('/pickups/upcoming');
  }

  // Payments endpoints
  async getTransactions() {
    return this.client.get<ApiResponse<any>>('/payments/transactions');
  }

  async makePayment(data: { amount: number; payment_method: string; reference?: string }) {
    return this.client.post<ApiResponse<any>>('/payments/make-payment', data);
  }

  // Health check
  async healthCheck() {
    return this.client.get<ApiResponse<any>>('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
