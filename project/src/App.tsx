import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/RegionalManager/Layout/Header';
import Hero from './components/RegionalManager/Home/Hero';
import Services from './components/RegionalManager/Home/Services';
import Contact from './components/RegionalManager/Home/Contact';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SuperAdminDashboard from './components/SaaS/SuperAdminDashboard';
import RegionalManagerWebsite from './components/RegionalManager/RegionalManagerWebsite';
import RegionalManagerDashboard from './components/RegionalManager/RegionalManagerDashboard';
import BusinessManagerDashboard from './components/BusinessManager/BusinessManagerDashboard';
import LandingPage from './components/SaaS/LandingPage';
import { OrganizationProvider } from './context/OrganizationContext';

type AppState = 'home' | 'register' | 'login' | 'super-admin-dashboard' | 'regional-manager-website' | 'regional-manager-dashboard' | 'business-manager-dashboard' | 'saas-landing';
type UserType = 'super_admin' | 'customer' | 'business_manager' | 'regional_manager' | null;

function App() {
  const [currentView, setCurrentView] = useState<AppState>('home');
  const [userType, setUserType] = useState<UserType>(null);

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setUserType(null);
  };

  const handleLoginSuccess = (type: UserType) => {
    setUserType(type);
    if (type === 'super_admin') {
      setCurrentView('super-admin-dashboard');
    } else if (type === 'customer') {
      setCurrentView('regional-manager-website');
    } else if (type === 'business_manager') {
      setCurrentView('business-manager-dashboard');
    } else if (type === 'regional_manager') {
      setCurrentView('regional-manager-dashboard');
    }
  };

  const handleNavigateToSaaS = () => {
    setCurrentView('saas-landing');
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentView('home');
  };

  // Render different views based on current state
  if (currentView === 'register') {
    return (
      <Router>
        <Register 
          onBack={handleBackToHome} 
          onLoginClick={handleLoginClick}
        />
      </Router>
    );
  }

  if (currentView === 'login') {
    return (
      <Router>
        <Login 
          onBack={handleBackToHome} 
          onRegisterClick={handleRegisterClick}
          onLoginSuccess={handleLoginSuccess}
        />
      </Router>
    );
  }

  if (currentView === 'super-admin-dashboard') {
    return (
      <Router>
        <SuperAdminDashboard onLogout={handleLogout} />
      </Router>
    );
  }

  if (currentView === 'regional-manager-website') {
    return (
      <Router>
        <RegionalManagerWebsite />
      </Router>
    );
  }

  if (currentView === 'business-manager-dashboard') {
    return (
      <Router>
        <BusinessManagerDashboard onLogout={handleLogout} />
      </Router>
    );
  }

  if (currentView === 'regional-manager-dashboard') {
    return (
      <Router>
        <RegionalManagerDashboard onLogout={handleLogout} />
      </Router>
    );
  }

  if (currentView === 'saas-landing') {
    return (
      <Router>
        <LandingPage />
      </Router>
    );
  }

  // Home page
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header 
          onNavigate={handleNavigate} 
          onRegisterClick={handleRegisterClick}
        />
        <Hero onRegisterClick={handleRegisterClick} />
        <Services />
        <Contact />
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white section-padding">
          <div className="container-max">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Mcbay Oilfield Services</h3>
                    <p className="text-sm text-gray-400">Waste Management Solutions</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  Professional waste management services across Nigeria. 
                  Reliable, efficient, and environmentally responsible.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Residential Collection</li>
                  <li>Commercial Services</li>
                  <li>Industrial Waste</li>
                  <li>Recycling Programs</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Our Team</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact Info</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>+234 812 345 6789</li>
                  <li>info@mcbayoilfield.com</li>
                  <li>Victoria Island, Lagos</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Mcbay Oilfield Services. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;