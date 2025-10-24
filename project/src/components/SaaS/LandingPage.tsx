import React from 'react';
import { ArrowRight, CheckCircle, Users, Shield, BarChart3, Globe, CreditCard, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Multi-Tenant Architecture',
      description: 'Each organization gets their own isolated environment with complete data separation.'
    },
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure access control with different permission levels for Business Managers and Regional Managers.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and analytics to track performance across all zones and customers.'
    },
    {
      icon: Globe,
      title: 'White-Label Solution',
      description: 'Customize your platform with your own branding, colors, and domain name.'
    },
    {
      icon: CreditCard,
      title: 'Flexible Billing',
      description: 'Multiple subscription tiers with usage-based limits and automated billing.'
    },
    {
      icon: Star,
      title: '24/7 Support',
      description: 'Dedicated support team to help you succeed with your waste management business.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 99,
      period: 'month',
      description: 'Perfect for small waste management companies',
      features: [
        'Up to 100 customers',
        '2 Regional Managers',
        '3 Zones',
        'Basic reporting',
        'Email support',
        'Custom branding'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: 199,
      period: 'month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 500 customers',
        '5 Regional Managers',
        '10 Zones',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom domain'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 399,
      period: 'month',
      description: 'For large organizations',
      features: [
        'Unlimited customers',
        'Unlimited managers',
        'Unlimited zones',
        'Custom features',
        'Dedicated support',
        'White label',
        'SLA guarantee'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'EcoWaste Solutions',
      content: 'This platform has transformed our waste management operations. The multi-tenant architecture allows us to manage multiple zones efficiently.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'GreenTech Waste',
      content: 'The analytics and reporting features give us insights we never had before. Our efficiency has increased by 40%.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      company: 'Sustainable Waste Co.',
      content: 'The white-label solution helped us maintain our brand identity while leveraging powerful technology.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Waste Management SaaS</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Login</button>
              <button className="btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Scale Your Waste Management Business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A complete multi-tenant SaaS platform for waste management companies. 
              Manage multiple zones, regional managers, and customers from one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="btn-outline text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to manage and grow your waste management business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative card ${
                plan.popular ? 'ring-2 ring-primary-500' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">₦{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-4 rounded-lg font-medium ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {plan.popular ? 'Start Free Trial' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Waste Management Companies
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of waste management companies already using our platform to scale their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-lg font-medium">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 rounded-lg font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold">Waste Management SaaS</span>
              </div>
              <p className="text-gray-400">
                The complete platform for waste management companies to scale their operations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Waste Management SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
