import React from 'react';
import { Truck, Shield, Clock, Users } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick }) => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 section-padding">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professional
                <span className="text-primary-600 block">Waste Management</span>
                Solutions
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Reliable, efficient, and eco-friendly waste collection services for your home and business. 
                Join thousands of satisfied customers across Nigeria.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onRegisterClick} className="btn-primary text-lg px-8 py-4">
                Get Started Today
              </button>
              <button className="btn-outline text-lg px-8 py-4">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Service Areas</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Reliable</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Waste Management Truck"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;