import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, TrendingUp, Users, MapPin, BarChart3 } from 'lucide-react';
import { useOrganization } from '../../context/OrganizationContext';

const SubscriptionManagement: React.FC = () => {
  const { subscription, tier, usage } = useOrganization();
  const [loading, setLoading] = useState(false);

  const subscriptionTiers = [
    {
      id: 1,
      name: 'Starter',
      price: 99,
      billing_cycle: 'monthly',
      max_customers: 100,
      max_managers: 2,
      max_zones: 3,
      features: ['Basic Reporting', 'Email Support', 'Custom Branding'],
      popular: false
    },
    {
      id: 2,
      name: 'Professional',
      price: 199,
      billing_cycle: 'monthly',
      max_customers: 500,
      max_managers: 5,
      max_zones: 10,
      features: ['Advanced Analytics', 'Priority Support', 'API Access', 'Custom Domain'],
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 399,
      billing_cycle: 'monthly',
      max_customers: -1,
      max_managers: -1,
      max_zones: -1,
      features: ['Custom Features', 'Dedicated Support', 'White Label', 'SLA Guarantee'],
      popular: false
    }
  ];

  const handleUpgrade = async (tierId: number) => {
    try {
      setLoading(true);
      // API call to upgrade subscription
      console.log('Upgrading to tier:', tierId);
      alert('Subscription upgrade initiated!');
    } catch (error) {
      alert('Error upgrading subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async (tierId: number) => {
    try {
      setLoading(true);
      // API call to downgrade subscription
      console.log('Downgrading to tier:', tierId);
      alert('Subscription downgrade initiated!');
    } catch (error) {
      alert('Error downgrading subscription');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'trial':
        return 'text-blue-600 bg-blue-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription?.status || 'trial')}`}>
            {subscription?.status?.toUpperCase() || 'TRIAL'}
          </span>
        </div>

        {subscription && tier && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Plan</p>
              <p className="text-xl font-bold text-gray-900">{tier.name}</p>
              <p className="text-sm text-gray-500">₦{tier.price}/month</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Billing Cycle</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{tier.billing_cycle}</p>
              <p className="text-sm text-gray-500">
                {subscription.next_billing_date ? `Next: ${new Date(subscription.next_billing_date).toLocaleDateString()}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Status</p>
              <p className="text-xl font-bold text-gray-900">
                {subscription.trial_end_date ? 
                  Math.ceil((new Date(subscription.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
                } days left
              </p>
              <p className="text-sm text-gray-500">Trial period</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Auto Renew</p>
              <p className="text-xl font-bold text-gray-900">{subscription.auto_renew ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-500">Automatic billing</p>
            </div>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      {usage && tier && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Statistics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Customers</span>
                </div>
                <span className="text-sm text-gray-600">
                  {usage.customers} / {tier.max_customers === -1 ? '∞' : tier.max_customers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(usage.customers, tier.max_customers)}%` }}
                ></div>
              </div>
              {getUsagePercentage(usage.customers, tier.max_customers) >= 80 && (
                <p className="text-sm text-yellow-600 mt-1">⚠️ Approaching limit</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Regional Managers</span>
                </div>
                <span className="text-sm text-gray-600">
                  {usage.managers} / {tier.max_managers === -1 ? '∞' : tier.max_managers}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(usage.managers, tier.max_managers)}%` }}
                ></div>
              </div>
              {getUsagePercentage(usage.managers, tier.max_managers) >= 80 && (
                <p className="text-sm text-yellow-600 mt-1">⚠️ Approaching limit</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Zones</span>
                </div>
                <span className="text-sm text-gray-600">
                  {usage.zones} / {tier.max_zones === -1 ? '∞' : tier.max_zones}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(usage.zones, tier.max_zones)}%` }}
                ></div>
              </div>
              {getUsagePercentage(usage.zones, tier.max_zones) >= 80 && (
                <p className="text-sm text-yellow-600 mt-1">⚠️ Approaching limit</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionTiers.map((plan) => (
            <div key={plan.id} className={`relative border rounded-lg p-6 ${
              plan.popular ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">₦{plan.price}</span>
                  <span className="text-gray-600">/{plan.billing_cycle}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{plan.max_customers === -1 ? 'Unlimited' : plan.max_customers} Customers</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{plan.max_managers === -1 ? 'Unlimited' : plan.max_managers} Managers</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{plan.max_zones === -1 ? 'Unlimited' : plan.max_zones} Zones</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {tier?.id === plan.id ? (
                  <button className="w-full btn-outline" disabled>
                    Current Plan
                  </button>
                ) : (
                  <>
                    {tier && tier.id < plan.id ? (
                      <button 
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loading}
                        className="w-full btn-primary"
                      >
                        {loading ? 'Processing...' : 'Upgrade'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDowngrade(plan.id)}
                        disabled={loading}
                        className="w-full btn-outline"
                      >
                        {loading ? 'Processing...' : 'Downgrade'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No billing history available</p>
          <p className="text-sm">Your billing history will appear here once you start paying</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
