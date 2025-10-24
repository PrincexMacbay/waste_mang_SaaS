import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface Organization {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  enabled_features: Record<string, boolean>;
  dashboard_layout: any;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  organization_id: string;
  tier_id: number;
  status: string;
  trial_start_date?: string;
  trial_end_date?: string;
  billing_start_date?: string;
  billing_end_date?: string;
  next_billing_date?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

interface SubscriptionTier {
  id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: string;
  max_customers: number;
  max_managers: number;
  max_zones: number;
  features: string[];
  is_active: boolean;
}

interface UsageStats {
  customers: number;
  managers: number;
  zones: number;
  pickups_this_month: number;
  revenue_this_month: number;
}

interface OrganizationContextType {
  organization: Organization | null;
  subscription: Subscription | null;
  tier: SubscriptionTier | null;
  usage: UsageStats | null;
  loading: boolean;
  error: string | null;
  refreshOrganization: () => Promise<void>;
  updateBranding: (data: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
  }) => Promise<void>;
  updateFeatures: (data: {
    enabled_features?: Record<string, boolean>;
    dashboard_layout?: any;
  }) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch organization data
      const orgResponse = await apiClient.getMyOrganization();
      setOrganization(orgResponse.data.data);

      // Fetch subscription data
      const subResponse = await apiClient.getMySubscription();
      setSubscription(subResponse.data.data);

      // Fetch usage stats
      const usageResponse = await apiClient.checkSubscriptionLimits();
      setUsage(usageResponse.data.data);

      // Apply branding to document
      if (orgResponse.data.data) {
        const org = orgResponse.data.data;
        document.documentElement.style.setProperty('--primary-color', org.primary_color);
        document.documentElement.style.setProperty('--secondary-color', org.secondary_color);
        document.documentElement.style.setProperty('--font-family', org.font_family);
      }

    } catch (err: any) {
      console.error('Error fetching organization data:', err);
      setError(err.response?.data?.message || 'Failed to fetch organization data');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganization = async () => {
    await fetchOrganizationData();
  };

  const updateBranding = async (data: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
  }) => {
    try {
      await apiClient.updateOrganization(data);
      await refreshOrganization();
    } catch (err: any) {
      console.error('Error updating branding:', err);
      throw err;
    }
  };

  const updateFeatures = async (data: {
    enabled_features?: Record<string, boolean>;
    dashboard_layout?: any;
  }) => {
    try {
      await apiClient.updateOrganizationFeatures(data);
      await refreshOrganization();
    } catch (err: any) {
      console.error('Error updating features:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const value: OrganizationContextType = {
    organization,
    subscription,
    tier,
    usage,
    loading,
    error,
    refreshOrganization,
    updateBranding,
    updateFeatures,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
