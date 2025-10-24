import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Lock } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onRegisterClick: () => void;
  onLoginSuccess: (userType: 'admin' | 'customer' | 'business_manager' | 'regional_manager') => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onRegisterClick, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or phone
    password: '',
    identifierType: 'email' // 'email' or 'phone'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    
    // Demo login logic
    if (formData.identifier === 'admin@mcbay.com' && formData.password === 'admin123') {
      onLoginSuccess('admin');
    } else if (formData.identifier === 'business@mcbay.com' && formData.password === 'business123') {
      onLoginSuccess('business_manager');
    } else if (formData.identifier === 'regional@mcbay.com' && formData.password === 'regional123') {
      onLoginSuccess('regional_manager');
    } else if (formData.identifier && formData.password) {
      onLoginSuccess('customer');
    } else {
      alert('Invalid credentials. Try:\n- admin@mcbay.com / admin123 (Admin)\n- business@mcbay.com / business123 (Business Manager)\n- regional@mcbay.com / regional123 (Regional Manager)');
    }
  };

  const handleGoogleSignin = () => {
    console.log('Google signin clicked');
    alert('Google signin will be implemented with OAuth integration.');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', resetEmail);
    alert(`Password reset link sent to ${resetEmail}`);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const detectIdentifierType = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    
    if (emailRegex.test(value)) {
      setFormData(prev => ({ ...prev, identifierType: 'email' }));
    } else if (phoneRegex.test(value)) {
      setFormData(prev => ({ ...prev, identifierType: 'phone' }));
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Login
            </button>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
              <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you a reset link
              </p>
            </div>
          </div>

          <form onSubmit={handleForgotPassword} className="card space-y-6">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="resetEmail"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account to manage your waste collection service
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            {/* Google Signin */}
            <button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  {formData.identifierType === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                  <input
                    type="text"
                    id="identifier"
                    required
                    value={formData.identifier}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, identifier: value });
                      detectIdentifierType(value);
                    }}
                    className="input-field pl-10"
                    placeholder="Enter your email or phone number"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Demo: Use admin@mcbay.com for admin access
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Demo: Use admin123 for admin access
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary mt-6">
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;