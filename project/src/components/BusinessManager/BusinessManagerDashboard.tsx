import React, { useState } from 'react';
import { 
  Users, CreditCard, Bell, MapPin, Truck, MessageSquare, 
  LogOut, Calendar, Download, AlertCircle, CheckCircle,
  Phone, Mail, Settings, Home, BarChart3, Globe, Shield
} from 'lucide-react';
import { useOrganization } from '../../context/OrganizationContext';

interface BusinessManagerDashboardProps {
  onLogout: () => void;
}

const BusinessManagerDashboard: React.FC<BusinessManagerDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { organization, subscription, tier, usage } = useOrganization();

  // Mock data for demonstration
  const teamData = {
    activeManagers: 3,
    pendingApprovals: 2,
    totalZones: 5,
    managers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', zone: 'Lekki Phase 1', status: 'active', lastActive: '2 hours ago' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', zone: 'Victoria Island', status: 'active', lastActive: '1 day ago' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', zone: 'Ikoyi', status: 'pending', lastActive: 'Never' },
    ]
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'zones', label: 'Zone Management', icon: MapPin },
    { id: 'customers', label: 'All Customers', icon: Users },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Organization Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organization Status</p>
              <p className="text-lg font-bold text-green-600">{organization?.status || 'Active'}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regional Managers</p>
              <p className="text-lg font-bold text-gray-900">{teamData.activeManagers}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-lg font-bold text-gray-900">{usage?.customers || 0}</p>
              <p className="text-sm text-gray-500">Across all zones</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-lg font-bold text-gray-900">₦{(usage?.revenue_this_month || 0).toLocaleString()}</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New regional manager registered</p>
              <p className="text-xs text-gray-500">Mike Johnson - Ikoyi Zone</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment received</p>
              <p className="text-xs text-gray-500">₦15,000 from Lekki Phase 1</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Zone performance report</p>
              <p className="text-xs text-gray-500">Victoria Island zone report ready</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Managers</p>
              <p className="text-2xl font-bold text-gray-900">{teamData.activeManagers}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{teamData.pendingApprovals}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-gray-900">{teamData.totalZones}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Managers List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Regional Managers</h3>
          <button className="btn-primary">
            Add New Manager
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Zone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamData.managers.map((manager) => (
                <tr key={manager.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{manager.name}</td>
                  <td className="py-3 px-4 text-gray-600">{manager.email}</td>
                  <td className="py-3 px-4 text-gray-600">{manager.zone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      manager.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {manager.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{manager.lastActive}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm">
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
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'team':
        return renderTeamManagement();
      case 'zones':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Zone Management</h2><p>Zone management features will be implemented here.</p></div>;
      case 'customers':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">All Customers</h2><p>Customer management features will be implemented here.</p></div>;
      case 'analytics':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Analytics & Reports</h2><p>Analytics and reporting features will be implemented here.</p></div>;
      case 'subscription':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Subscription Management</h2><p>Subscription management features will be implemented here.</p></div>;
      case 'settings':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Organization Settings</h2><p>Organization settings will be implemented here.</p></div>;
      case 'audit':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Audit Logs</h2><p>Audit log viewer will be implemented here.</p></div>;
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Business Manager Portal</h1>
              <p className="text-xs text-gray-500">Organization Dashboard</p>
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
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
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
              <p className="text-gray-600">Welcome back, Business Manager</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">BM</span>
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

export default BusinessManagerDashboard;
