import React, { useState } from 'react';
import { Save, Upload, Palette, Globe, Settings as SettingsIcon } from 'lucide-react';
import { useOrganization } from '../../context/OrganizationContext';

const OrganizationSettings: React.FC = () => {
  const { organization, updateBranding, updateFeatures } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: organization?.name || '',
    phone: organization?.phone || '',
    email: organization?.email || '',
    address: organization?.address || '',
    website: organization?.website || '',
    logo_url: organization?.logo_url || '',
    primary_color: organization?.primary_color || '#2563eb',
    secondary_color: organization?.secondary_color || '#1e40af',
    font_family: organization?.font_family || 'Inter',
  });

  const [features, setFeatures] = useState({
    enabled_features: organization?.enabled_features || {},
    dashboard_layout: organization?.dashboard_layout || {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
    setFormData(prev => ({
      ...prev,
      [type === 'primary' ? 'primary_color' : 'secondary_color']: color
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => ({
      ...prev,
      enabled_features: {
        ...prev.enabled_features,
        [feature]: !prev.enabled_features[feature]
      }
    }));
  };

  const handleSaveGeneral = async () => {
    try {
      setLoading(true);
      await updateBranding(formData);
      alert('Organization settings updated successfully!');
    } catch (error) {
      alert('Error updating organization settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeatures = async () => {
    try {
      setLoading(true);
      await updateFeatures(features);
      alert('Organization features updated successfully!');
    } catch (error) {
      alert('Error updating organization features');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'features', label: 'Features', icon: Globe },
  ];

  const availableFeatures = [
    { key: 'advanced_analytics', label: 'Advanced Analytics', description: 'Detailed reporting and insights' },
    { key: 'custom_domain', label: 'Custom Domain', description: 'Use your own domain name' },
    { key: 'api_access', label: 'API Access', description: 'Access to REST API' },
    { key: 'white_label', label: 'White Label', description: 'Remove SaaS branding' },
    { key: 'priority_support', label: 'Priority Support', description: '24/7 priority support' },
    { key: 'sla_guarantee', label: 'SLA Guarantee', description: 'Service level agreement' },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter organization name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter website URL"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="input-field resize-none"
          rows={3}
          placeholder="Enter organization address"
        />
      </div>
      <button
        onClick={handleSaveGeneral}
        disabled={loading}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving...' : 'Save General Settings'}</span>
      </button>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
        <div className="flex space-x-3">
          <input
            type="url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleInputChange}
            className="input-field flex-1"
            placeholder="Enter logo URL"
          />
          <button className="btn-outline flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
        {formData.logo_url && (
          <div className="mt-3">
            <img src={formData.logo_url} alt="Logo preview" className="w-20 h-20 object-contain border rounded" />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex space-x-3">
            <input
              type="color"
              value={formData.primary_color}
              onChange={(e) => handleColorChange(e.target.value, 'primary')}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.primary_color}
              onChange={(e) => handleColorChange(e.target.value, 'primary')}
              className="input-field flex-1"
              placeholder="#2563eb"
            />
          </div>
          <div className="mt-2 p-3 rounded" style={{ backgroundColor: formData.primary_color }}>
            <p className="text-white text-sm">Primary Color Preview</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <div className="flex space-x-3">
            <input
              type="color"
              value={formData.secondary_color}
              onChange={(e) => handleColorChange(e.target.value, 'secondary')}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.secondary_color}
              onChange={(e) => handleColorChange(e.target.value, 'secondary')}
              className="input-field flex-1"
              placeholder="#1e40af"
            />
          </div>
          <div className="mt-2 p-3 rounded" style={{ backgroundColor: formData.secondary_color }}>
            <p className="text-white text-sm">Secondary Color Preview</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
        <select
          name="font_family"
          value={formData.font_family}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Poppins">Poppins</option>
        </select>
        <div className="mt-2 p-3 rounded border" style={{ fontFamily: formData.font_family }}>
          <p className="text-sm">Font Preview - This is how your text will look</p>
        </div>
      </div>

      <button
        onClick={handleSaveGeneral}
        disabled={loading}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving...' : 'Save Branding Settings'}</span>
      </button>
    </div>
  );

  const renderFeaturesSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Features</h3>
        <div className="space-y-4">
          {availableFeatures.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feature.label}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.enabled_features[feature.key] || false}
                  onChange={() => handleFeatureToggle(feature.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSaveFeatures}
        disabled={loading}
        className="btn-primary flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving...' : 'Save Feature Settings'}</span>
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'branding':
        return renderBrandingSettings();
      case 'features':
        return renderFeaturesSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="card">
        {renderContent()}
      </div>
    </div>
  );
};

export default OrganizationSettings;
