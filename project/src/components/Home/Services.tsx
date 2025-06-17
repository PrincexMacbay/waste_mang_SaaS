import React from 'react';
import { Truck, Home, Building, Factory, Recycle, Clock } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Home,
      title: 'Residential Collection',
      description: 'Regular waste pickup for homes, apartments, and residential complexes with flexible scheduling.',
      features: ['Weekly/Bi-weekly pickup', 'Recyclable sorting', 'Bulk item removal']
    },
    {
      icon: Building,
      title: 'Commercial Services',
      description: 'Comprehensive waste management solutions for offices, retail stores, and small businesses.',
      features: ['Daily pickup options', 'Document shredding', 'Customized containers']
    },
    {
      icon: Factory,
      title: 'Industrial Waste',
      description: 'Specialized handling of industrial waste with proper disposal and environmental compliance.',
      features: ['Hazardous waste handling', 'Compliance reporting', 'Emergency cleanup']
    },
    {
      icon: Recycle,
      title: 'Recycling Programs',
      description: 'Eco-friendly recycling services to reduce environmental impact and promote sustainability.',
      features: ['Material sorting', 'Buyback programs', 'Environmental reports']
    },
    {
      icon: Truck,
      title: 'Special Collections',
      description: 'On-demand services for large items, construction debris, and special waste materials.',
      features: ['Same-day service', 'Construction debris', 'Appliance removal']
    },
    {
      icon: Clock,
      title: 'Emergency Services',
      description: '24/7 emergency waste collection and cleanup services for urgent situations.',
      features: ['24/7 availability', 'Rapid response', 'Disaster cleanup']
    }
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive waste management solutions tailored to meet your specific needs, 
            from residential pickup to industrial waste handling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary text-lg px-8 py-4">
            Request a Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;