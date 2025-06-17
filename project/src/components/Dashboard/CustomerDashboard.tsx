import React, { useState } from 'react';
import { 
  User, CreditCard, Bell, MapPin, Truck, MessageSquare, 
  LogOut, Calendar, Download, AlertCircle, CheckCircle,
  Phone, Mail, Settings, Home
} from 'lucide-react';

interface CustomerDashboardProps {
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock customer data
  const customerData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+234 812 345 6789',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    houseType: 'Duplex',
    flats: 1,
    occupants: 4,
    zone: 'Lekki Phase 1',
    subscriptionStatus: 'Active',
    nextPickup: '2024-01-15T07:00:00',
    monthlyFee: 15000,
    lastPayment: '2024-01-01',
    paymentStatus: 'Paid'
  };

  const transactions = [
    { id: 'INV-001', date: '2024-01-01', amount: 15000, status: 'paid', method: 'Card' },
    { id: 'INV-002', date: '2023-12-01', amount: 15000, status: 'paid', method: 'Transfer' },
    { id: 'INV-003', date: '2023-11-01', amount: 15000, status: 'paid', method: 'Card' },
    { id: 'INV-004', date: '2023-10-01', amount: 15000, status: 'paid', method: 'USSD' },
  ];

  const notifications = [
    { id: 1, type: 'general', title: 'Pickup Schedule Update', message: 'Your next pickup has been rescheduled to 8:00 AM', date: '2024-01-10', read: false },
    { id: 2, type: 'payment', title: 'Payment Successful', message: 'Your payment of ₦15,000 has been processed successfully', date: '2024-01-01', read: true },
    { id: 3, type: 'emergency', title: 'Service Disruption', message: 'Temporary service disruption in your area due to road maintenance', date: '2023-12-28', read: true },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile & Address', icon: User },
    { id: 'transactions', label: 'Transaction History', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'tracking', label: 'Pickup Tracking', icon: Truck },
    { id: 'payment', label: 'Make Payment', icon: CreditCard },
    { id: 'complaint', label: 'Submit Complaint', icon: MessageSquare },
    { id: 'cancel', label: 'Cancel Subscription', icon: AlertCircle },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscription Status</p>
              <p className="text-lg font-bold text-green-600">{customerData.subscriptionStatus}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <button className="mt-3 btn-outline w-full text-sm">
            Renew Now
          </button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Pickup</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(customerData.nextPickup).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(customerData.nextPickup).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Transaction</p>
              <p className="text-lg font-bold text-gray-900">₦{customerData.monthlyFee.toLocaleString()}</p>
              <p className="text-sm text-green-600">Paid</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Zone Info</p>
              <p className="text-lg font-bold text-gray-900">{customerData.zone}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
          <button 
            onClick={() => setActiveTab('notifications')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" value={customerData.name} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={customerData.email} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" value={customerData.phone} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
            <input type="text" value={customerData.zone} className="input-field" readOnly />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Residence Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
            <input type="text" value={customerData.houseType} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Flats</label>
            <input type="number" value={customerData.flats} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupants</label>
            <input type="number" value={customerData.occupants} className="input-field" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fee</label>
            <input type="text" value={`₦${customerData.monthlyFee.toLocaleString()}`} className="input-field" readOnly />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea value={customerData.address} className="input-field resize-none" rows={3} readOnly />
        </div>
        <button className="mt-6 btn-primary">Edit Profile</button>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <div className="flex space-x-2">
          <button className="btn-outline text-sm">Export PDF</button>
          <button className="btn-outline text-sm">Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{transaction.id}</td>
                <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                <td className="py-3 px-4 font-medium text-gray-900">₦{transaction.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600">{transaction.method}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    <Download className="w-4 h-4" />
                  </button>
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
      case 'profile':
        return renderProfile();
      case 'transactions':
        return renderTransactions();
      case 'notifications':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Notifications</h2><p>Notifications panel will be implemented here.</p></div>;
      case 'tracking':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Pickup Tracking</h2><p>Pickup tracking features will be implemented here.</p></div>;
      case 'payment':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Make Payment</h2><p>Payment form will be implemented here.</p></div>;
      case 'complaint':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Submit Complaint</h2><p>Complaint form will be implemented here.</p></div>;
      case 'cancel':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Cancel Subscription</h2><p>Cancellation form will be implemented here.</p></div>;
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
              <h1 className="text-lg font-bold text-gray-900">My Dashboard</h1>
              <p className="text-xs text-gray-500">Customer Portal</p>
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
              <p className="text-gray-600">Welcome back, {customerData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {customerData.name.split(' ').map(n => n[0]).join('')}
                </span>
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

export default CustomerDashboard;