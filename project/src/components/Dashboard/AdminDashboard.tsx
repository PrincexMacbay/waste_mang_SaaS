import React, { useState } from 'react';
import { 
  Users, DollarSign, TrendingUp, AlertCircle, Bell, Truck, 
  Plus, Settings, LogOut, BarChart3, PieChart, Calendar,
  MessageSquare, CreditCard, Route, UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const dashboardStats = {
    totalCustomers: 1242,
    activeCustomers: 1050,
    monthlyRevenue: 2540000,
    netProfit: 1820000,
    pendingComplaints: 8,
    notificationsSent: 120
  };

  const revenueData = [
    { month: 'Jan', revenue: 2100000 },
    { month: 'Feb', revenue: 2300000 },
    { month: 'Mar', revenue: 2200000 },
    { month: 'Apr', revenue: 2450000 },
    { month: 'May', revenue: 2540000 },
    { month: 'Jun', revenue: 2680000 },
  ];

  const customerGrowthData = [
    { month: 'Jan', customers: 980 },
    { month: 'Feb', customers: 1050 },
    { month: 'Mar', customers: 1120 },
    { month: 'Apr', customers: 1180 },
    { month: 'May', customers: 1220 },
    { month: 'Jun', customers: 1242 },
  ];

  const complaintData = [
    { name: 'Resolved', value: 85, color: '#22c55e' },
    { name: 'In Progress', value: 12, color: '#f59e0b' },
    { name: 'Pending', value: 3, color: '#ef4444' },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'messaging', label: 'Messaging & Notifications', icon: MessageSquare },
    { id: 'payments', label: 'Payment Management', icon: CreditCard },
    { id: 'routes', label: 'Truck Schedule & Routes', icon: Route },
    { id: 'complaints', label: 'Complaints & Feedback', icon: AlertCircle },
    { id: 'register', label: 'Register Customer', icon: UserPlus },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Customers"
          value={dashboardStats.totalCustomers.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          change={8.2}
        />
        <StatCard
          title="Active Customers"
          value={dashboardStats.activeCustomers.toLocaleString()}
          icon={Users}
          color="bg-green-500"
          change={5.1}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₦${(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="bg-primary-500"
          change={12.3}
        />
        <StatCard
          title="Net Profit"
          value={`₦${(dashboardStats.netProfit / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          color="bg-purple-500"
          change={15.8}
        />
        <StatCard
          title="Pending Complaints"
          value={dashboardStats.pendingComplaints}
          icon={AlertCircle}
          color="bg-red-500"
          change={-20.5}
        />
        <StatCard
          title="Notifications Sent"
          value={dashboardStats.notificationsSent}
          icon={Bell}
          color="bg-orange-500"
          change={25.0}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Send Notification</span>
          </button>
          <button className="btn-outline flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Route</span>
          </button>
          <button className="btn-outline flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Adjust Pricing</span>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₦${(Number(value) / 1000000).toFixed(1)}M`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Resolution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={complaintData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {complaintData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {complaintData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Truck Schedules</h3>
          <div className="space-y-3">
            {[
              { route: 'Victoria Island Route', time: '7:00 AM', truck: 'Truck A', status: 'On Schedule' },
              { route: 'Lekki Phase 1', time: '9:00 AM', truck: 'Truck B', status: 'Delayed' },
              { route: 'Ikoyi Residential', time: '11:00 AM', truck: 'Truck C', status: 'On Schedule' },
              { route: 'Surulere Zone', time: '2:00 PM', truck: 'Truck D', status: 'On Schedule' },
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{schedule.route}</p>
                    <p className="text-sm text-gray-600">{schedule.truck} • {schedule.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  schedule.status === 'On Schedule' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'customers':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Customer Management</h2><p>Customer management features will be implemented here.</p></div>;
      case 'messaging':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Messaging & Notifications</h2><p>Messaging features will be implemented here.</p></div>;
      case 'payments':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Payment Management</h2><p>Payment management features will be implemented here.</p></div>;
      case 'routes':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Truck Schedule & Routes</h2><p>Route management features will be implemented here.</p></div>;
      case 'complaints':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Complaints & Feedback</h2><p>Complaint management features will be implemented here.</p></div>;
      case 'register':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Register New Customer</h2><p>Customer registration form will be implemented here.</p></div>;
      case 'settings':
        return <div className="card"><h2 className="text-2xl font-bold mb-4">Account Settings</h2><p>Settings panel will be implemented here.</p></div>;
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
              <h1 className="text-lg font-bold text-gray-900">Mcbay Admin</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
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
              <p className="text-gray-600">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
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