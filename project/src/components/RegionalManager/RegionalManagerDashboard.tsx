import React, { useState } from 'react';
import { 
  Users, CreditCard, Bell, MapPin, Truck, MessageSquare, 
  LogOut, Calendar, Download, AlertCircle, CheckCircle,
  Phone, Mail, Settings, Home, BarChart3, Globe
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const zoneData = {
    name: 'Lekki Phase 1',
    customers: 45,
    pickupsToday: 8,
    revenue: 675000,
    complaints: 2
  };

  const recentCustomers = [
    { id: 1, name: 'John Doe', address: '15 Admiralty Way', phone: '+234 812 345 6789', status: 'active', lastPickup: '2024-01-15' },
    { id: 2, name: 'Jane Smith', address: '22 Admiralty Way', phone: '+234 803 456 7890', status: 'active', lastPickup: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', address: '8 Admiralty Way', phone: '+234 815 567 8901', status: 'pending', lastPickup: 'Never' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Zone Overview', icon: Home },
    { id: 'customers', label: 'End User Management', icon: Users },
    { id: 'pickups', label: 'Pickup Scheduling', icon: Truck },
    { id: 'payments', label: 'Payment Collection', icon: CreditCard },
    { id: 'complaints', label: 'Customer Complaints', icon: MessageSquare },
    { id: 'reports', label: 'Zone Reports', icon: BarChart3 },
    { id: 'website', label: 'My Website', icon: Globe },
    { id: 'settings', label: 'Zone Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Zone Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Zone Name</p>
              <p className="text-lg font-bold text-gray-900">{zoneData.name}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-lg font-bold text-gray-900">{zoneData.customers}</p>
              <p className="text-sm text-gray-500">Active customers</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pickups Today</p>
              <p className="text-lg font-bold text-gray-900">{zoneData.pickupsToday}</p>
              <p className="text-sm text-gray-500">Scheduled</p>
            </div>
            <Truck className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-lg font-bold text-gray-900">₦{zoneData.revenue.toLocaleString()}</p>
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
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment received</p>
              <p className="text-xs text-gray-500">₦15,000 from John Doe</p>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New customer registered</p>
              <p className="text-xs text-gray-500">Mike Johnson - 8 Admiralty Way</p>
            </div>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Complaint received</p>
              <p className="text-xs text-gray-500">Service quality issue from Jane Smith</p>
            </div>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">End Users</h3>
        <button className="btn-primary">
          Add New Customer
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Address</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Last Pickup</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{customer.name}</td>
                <td className="py-3 px-4 text-gray-600">{customer.address}</td>
                <td className="py-3 px-4 text-gray-600">{customer.phone}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{customer.lastPickup}</td>
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
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'customers':
        return renderCustomers();
      case 'pickups':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Pickup Scheduling</h2><p>Pickup scheduling features will be implemented here.</p></div>;
      case 'payments':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Payment Collection</h2><p>Payment collection features will be implemented here.</p></div>;
      case 'complaints':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Customer Complaints</h2><p>Complaint management features will be implemented here.</p></div>;
      case 'reports':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Zone Reports</h2><p>Reporting features will be implemented here.</p></div>;
      case 'website':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">My Website</h2><p>Website customization features will be implemented here.</p></div>;
      case 'settings':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Zone Settings</h2><p>Zone settings will be implemented here.</p></div>;
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
              <h1 className="text-lg font-bold text-gray-900">Regional Manager</h1>
              <p className="text-xs text-gray-500">Zone Dashboard</p>
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
              <p className="text-gray-600">Welcome back, Regional Manager</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">RM</span>
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

export default AdminDashboard;