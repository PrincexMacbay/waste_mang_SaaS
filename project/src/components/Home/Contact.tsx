import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Users } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    contactType: 'phone',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', contact: '', contactType: 'phone', message: '' });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to know more about your waste management services.');
    window.open(`https://wa.me/2348120019978?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your waste management service? Contact us today for a free consultation 
            and customized solution for your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+234 812 001 9978</p>
                    <p className="text-gray-600">+234 812 001 9978</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@mcbayoilfield.com</p>
                    <p className="text-gray-600">support@mcbayoilfield.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">
                      21 UTI STREET, <br />
                      P.T.I ROAD, <br />
                      EFFURUN, <br />
                      DELTA STATE,<br />
                      NIGERIA.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 7:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 8:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Emergency only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quick Contact</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
                
                <a
                  href="tel:+2348120019978"
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>
                
                <a
                  href="mailto:info@mcbayoilfield.com"
                  className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Type
                </label>
                <select
                  id="contactType"
                  value={formData.contactType}
                  onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                  className="input-field"
                >
                  <option value="phone">Phone Number</option>
                  <option value="email">Email Address</option>
                  <option value="whatsapp">WhatsApp Number</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.contactType === 'email' ? 'Email Address' : 
                   formData.contactType === 'whatsapp' ? 'WhatsApp Number' : 'Phone Number'} *
                </label>
                <input
                  type={formData.contactType === 'email' ? 'email' : 'tel'}
                  id="contact"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="input-field"
                  placeholder={
                    formData.contactType === 'email' ? 'your@email.com' :
                    formData.contactType === 'whatsapp' ? '+234 xxx xxx xxxx' : '+234 xxx xxx xxxx'
                  }
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Tell us about your waste management needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;