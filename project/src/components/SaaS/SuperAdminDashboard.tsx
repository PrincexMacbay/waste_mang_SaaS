import React, { useState } from 'react';
import { 
  Users, Building2, DollarSign, TrendingUp, AlertCircle, Bell, 
  Settings, LogOut, BarChart3, PieChart, Calendar, Shield,
  Globe, CreditCard, MessageSquare, UserPlus, Building
} from 'lucide-react';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const platformStats = {
    totalOrganizations: 24,
    activeOrganizations: 18,
    totalUsers: 1242,
    monthlyRevenue: 2540000,
    trialOrganizations: 6,
    suspendedOrganizations: 2
  };

  const organizations = [
    { id: 1, name: 'Lekki Waste Solutions', email: 'admin@lekkiwaste.com', status: 'active', users: 45, revenue: 675000, created: '2024-01-15' },
    { id: 2, name: 'Victoria Island Clean', email: 'admin@viclean.com', status: 'trial', users: 12, revenue: 0, created: '2024-01-20' },
    { id: 3, name: 'Ikoyi Environmental', email: 'admin@ikoyienv.com', status: 'active', users: 38, revenue: 570000, created: '2024-01-10' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Organizations</p>
              <p className="text-lg font-bold text-gray-900">{platformStats.totalOrganizations}</p>
              <p className="text-sm text-gray-500">{platformStats.activeOrganizations} active</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-lg font-bold text-gray-900">{platformStats.totalUsers}</p>
              <p className="text-sm text-gray-500">Across all organizations</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-lg font-bold text-gray-900">₦{platformStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Organizations</p>
              <p className="text-lg font-bold text-gray-900">{platformStats.trialOrganizations}</p>
              <p className="text-sm text-yellow-600">Need attention</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New organization registered</p>
              <p className="text-xs text-gray-500">Victoria Island Clean - Trial started</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Subscription upgraded</p>
              <p className="text-xs text-gray-500">Lekki Waste Solutions - Professional plan</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Trial expiring soon</p>
              <p className="text-xs text-gray-500">Ikoyi Environmental - 3 days left</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganizations = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
        <button className="btn-primary">
          Add Organization
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Organization</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Users</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{org.name}</td>
                <td className="py-3 px-4 text-gray-600">{org.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    org.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : org.status === 'trial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {org.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{org.users}</td>
                <td className="py-3 px-4 text-gray-600">₦{org.revenue.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600">{org.created}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">
                      View
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-700 text-sm">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'organizations':
        return renderOrganizations();
      case 'users':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">All Users</h2><p>User management features will be implemented here.</p></div>;
      case 'subscriptions':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Subscriptions</h2><p>Subscription management features will be implemented here.</p></div>;
      case 'revenue':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2><p>Revenue analytics features will be implemented here.</p></div>;
      case 'audit':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Audit Logs</h2><p>Audit log features will be implemented here.</p></div>;
      case 'settings':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Platform Settings</h2><p>Platform settings will be implemented here.</p></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Super Admin</h1>
              <p className="text-xs text-gray-500">Platform Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="px-4 pb-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Welcome back, Super Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SA</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
