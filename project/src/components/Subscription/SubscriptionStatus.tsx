import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle, TrendingUp, Users, MapPin } from 'lucide-react';
import { useOrganization } from '../../context/OrganizationContext';

const SubscriptionStatus: React.FC = () => {
  const { subscription, tier, usage } = useOrganization();

  if (!subscription || !tier) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No subscription information available</p>
        </div>
      </div>
    );
  }

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

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const isNearLimit = (current: number, max: number) => {
    if (max === -1) return false; // Unlimited
    return (current / max) >= 0.8;
  };

  const daysLeftInTrial = subscription.trial_end_date 
    ? Math.ceil((new Date(subscription.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* Trial Alert */}
      {subscription.status === 'trial' && daysLeftInTrial > 0 && (
        <div className={`card ${
          daysLeftInTrial <= 3 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className={`w-5 h-5 mr-3 ${
              daysLeftInTrial <= 3 ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                daysLeftInTrial <= 3 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {daysLeftInTrial <= 3 ? 'Trial Expiring Soon!' : 'Trial Period Active'}
              </h3>
              <p className={`text-sm ${
                daysLeftInTrial <= 3 ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {daysLeftInTrial} days left in your trial. 
                {daysLeftInTrial <= 3 && ' Upgrade now to avoid service interruption.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
            {subscription.status.toUpperCase()}
          </span>
        </div>

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
            <p className="text-sm font-medium text-gray-600">Auto Renew</p>
            <p className="text-xl font-bold text-gray-900">{subscription.auto_renew ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-500">Automatic billing</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Trial Status</p>
            <p className="text-xl font-bold text-gray-900">
              {subscription.trial_end_date ? `${daysLeftInTrial} days left` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">Trial period</p>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      {usage && (
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
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isNearLimit(usage.customers, tier.max_customers) ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.customers, tier.max_customers)}%` }}
                ></div>
              </div>
              {isNearLimit(usage.customers, tier.max_customers) && (
                <p className="text-sm text-red-600 mt-1">⚠️ Approaching limit</p>
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
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isNearLimit(usage.managers, tier.max_managers) ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.managers, tier.max_managers)}%` }}
                ></div>
              </div>
              {isNearLimit(usage.managers, tier.max_managers) && (
                <p className="text-sm text-red-600 mt-1">⚠️ Approaching limit</p>
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
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isNearLimit(usage.zones, tier.max_zones) ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${getUsagePercentage(usage.zones, tier.max_zones)}%` }}
                ></div>
              </div>
              {isNearLimit(usage.zones, tier.max_zones) && (
                <p className="text-sm text-red-600 mt-1">⚠️ Approaching limit</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {subscription.status === 'trial' && (
            <button className="btn-primary flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Upgrade Now</span>
            </button>
          )}
          <button className="btn-outline flex items-center justify-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Change Plan</span>
          </button>
          <button className="btn-outline flex items-center justify-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Manage Subscription</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
