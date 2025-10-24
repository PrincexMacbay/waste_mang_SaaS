import React, { useState } from 'react';
import { Menu, X, ChevronDown, Download, Phone, Mail, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const handleDownload = (type: 'authorization' | 'business') => {
    // Simulate PDF download
    const fileName = type === 'authorization' ? 'area-authorization.pdf' : 'business-certification.pdf';
    console.log(`Downloading ${fileName}`);
    // In a real app, this would trigger an actual download
    alert(`Downloading ${fileName}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mcbay Oilfield Services</h1>
              <p className="text-xs text-gray-500">Waste Management Solutions</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Certificates Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCertificateOpen(!isCertificateOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <span>Certificates</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCertificateOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCertificateOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => handleDownload('authorization')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Area of Authorization</span>
                  </button>
                  <button
                    onClick={() => handleDownload('business')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Business Name Certificate</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Services
            </button>
            
            <button
              onClick={() => onNavigate('contact')}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Contact Us
            </button>
            
            <button
              onClick={onRegisterClick}
              className="btn-primary"
            >
              Register
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setIsCertificateOpen(!isCertificateOpen)}
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-primary-600"
                >
                  <span>Certificates</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCertificateOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCertificateOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <button
                      onClick={() => handleDownload('authorization')}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                    >
                      <Download className="w-4 h-4" />
                      <span>Area of Authorization</span>
                    </button>
                    <button
                      onClick={() => handleDownload('business')}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                    >
                      <Download className="w-4 h-4" />
                      <span>Business Name Certificate</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  onNavigate('services');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-primary-600"
              >
                Services
              </button>
              
              <button
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-primary-600"
              >
                Contact Us
              </button>
              
              <button
                onClick={() => {
                  onRegisterClick();
                  setIsMenuOpen(false);
                }}
                className="btn-primary w-full"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;