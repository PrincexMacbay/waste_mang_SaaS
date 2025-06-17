import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Home, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onBack: () => void;
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Account Creation
    fullName: '',
    phone: '',
    email: '',
    area: '',
    street: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Residence & Service Details
    buildingType: '',
    occupants: 1,
    wasteVolume: '',
    pickupFrequency: '',
    estimatedPrice: 0
  });

  const areas = [
    'Victoria Island', 'Ikoyi', 'Lekki', 'Ajah', 'Surulere', 'Ikeja', 'Yaba', 'Gbagada',
    'Magodo', 'Ojodu', 'Berger', 'Ketu', 'Mile 12', 'Ikorodu', 'Epe', 'Badagry'
  ];

  const buildingTypes = [
    { value: 'flat', label: 'Flat/Apartment', basePrice: 8000 },
    { value: 'duplex', label: 'Duplex', basePrice: 15000 },
    { value: 'bungalow', label: 'Bungalow', basePrice: 12000 },
    { value: 'mansion', label: 'Mansion', basePrice: 25000 },
    { value: 'hotel', label: 'Hotel/Lodge', basePrice: 30000 },
    { value: 'office', label: 'Office Building', basePrice: 20000 },
    { value: 'shop', label: 'Shop/Store', basePrice: 10000 }
  ];

  const wasteVolumes = [
    { value: 'low', label: 'Low (1-2 bags/week)', multiplier: 0.8 },
    { value: 'medium', label: 'Medium (3-5 bags/week)', multiplier: 1.0 },
    { value: 'high', label: 'High (6+ bags/week)', multiplier: 1.3 }
  ];

  const pickupFrequencies = [
    { value: '1x', label: '1x per week', multiplier: 0.7 },
    { value: '2x', label: '2x per week', multiplier: 1.0 },
    { value: '3x', label: '3x per week', multiplier: 1.4 }
  ];

  // Calculate estimated price
  React.useEffect(() => {
    const buildingType = buildingTypes.find(bt => bt.value === formData.buildingType);
    const wasteVolume = wasteVolumes.find(wv => wv.value === formData.wasteVolume);
    const frequency = pickupFrequencies.find(pf => pf.value === formData.pickupFrequency);
    
    if (buildingType && wasteVolume && frequency) {
      const basePrice = buildingType.basePrice;
      const occupantMultiplier = Math.max(1, formData.occupants / 4);
      const estimatedPrice = basePrice * wasteVolume.multiplier * frequency.multiplier * occupantMultiplier;
      setFormData(prev => ({ ...prev, estimatedPrice: Math.round(estimatedPrice) }));
    }
  }, [formData.buildingType, formData.wasteVolume, formData.pickupFrequency, formData.occupants]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration completed:', formData);
    alert('Registration successful! Welcome to Mcbay Waste Management Services.');
    onBack();
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    alert('Google signup will be implemented with OAuth integration.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1 ? 'Create Account' : 'Service Details'}
            </h2>
            <p className="mt-2 text-gray-600">
              {step === 1 
                ? 'Join thousands of satisfied customers' 
                : 'Help us serve you better'
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Account Info</span>
              <span>Service Setup</span>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Account Creation */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="card">
              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                <span className="text-gray-700 font-medium">Sign up with Google</span>
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
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field pl-10"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field pl-10"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Zone *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="area"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="input-field pl-10"
                    >
                      <option value="">Select your area</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="street"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="input-field pl-10"
                      placeholder="Enter your street address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field pr-10"
                      placeholder="Create a strong password"
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
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field pr-10"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary mt-6">
                Continue to Service Details
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Residence & Service Details */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-6">
            <div className="card">
              <div className="space-y-4">
                <div>
                  <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Building *
                  </label>
                  <select
                    id="buildingType"
                    required
                    value={formData.buildingType}
                    onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select building type</option>
                    {buildingTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} (₦{type.basePrice.toLocaleString()}/month base)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="occupants" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Occupants/Flats *
                  </label>
                  <input
                    type="number"
                    id="occupants"
                    required
                    min="1"
                    max="50"
                    value={formData.occupants}
                    onChange={(e) => setFormData({ ...formData, occupants: parseInt(e.target.value) || 1 })}
                    className="input-field"
                    placeholder="Enter number of occupants or flats"
                  />
                </div>

                <div>
                  <label htmlFor="wasteVolume" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Monthly Waste Volume
                  </label>
                  <select
                    id="wasteVolume"
                    value={formData.wasteVolume}
                    onChange={(e) => setFormData({ ...formData, wasteVolume: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select waste volume</option>
                    {wasteVolumes.map(volume => (
                      <option key={volume.value} value={volume.value}>
                        {volume.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pickupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Pickup Frequency *
                  </label>
                  <select
                    id="pickupFrequency"
                    required
                    value={formData.pickupFrequency}
                    onChange={(e) => setFormData({ ...formData, pickupFrequency: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select pickup frequency</option>
                    {pickupFrequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Preview */}
                {formData.estimatedPrice > 0 && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="font-semibold text-primary-900 mb-2">Estimated Monthly Price</h4>
                    <div className="text-2xl font-bold text-primary-600">
                      ₦{formData.estimatedPrice.toLocaleString()}
                    </div>
                    <p className="text-sm text-primary-700 mt-1">
                      Final price may vary based on specific requirements and location
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Confirm & Subscribe
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;