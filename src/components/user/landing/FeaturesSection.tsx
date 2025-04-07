import React from 'react';
import { Bus, Calendar, Users, MapPin, CreditCard, Shield, Clock, MessageSquare, Star } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Smart Booking',
      description: 'Find and book private buses in seconds with our intelligent booking system.',
      icon: <Bus className="h-12 w-12 text-blue-600 mb-4" />,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'Trip Planner',
      description: 'Get personalized routes and fare estimates with our advanced trip planning tools.',
      icon: <Calendar className="h-12 w-12 text-blue-600 mb-4" />,
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000'
    },
    {
      title: 'Travel Community',
      description: 'Connect with fellow travelers and share experiences in our vibrant community.',
      icon: <Users className="h-12 w-12 text-blue-600 mb-4" />,
      image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  const additionalFeatures = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Real-time Tracking',
      description: 'Track your bus location in real-time for precise arrival times.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Verified Operators',
      description: 'All bus operators are verified and regularly audited.'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs.'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: 'Live Chat',
      description: 'Instant communication with our support team.'
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      title: 'Rewards Program',
      description: 'Earn points on every booking and get exclusive benefits.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Features */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BusQuik</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of bus travel with our innovative features and services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">More Amazing Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 text-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-lg mb-6">Join thousands of satisfied travelers who trust TravelEase for their bus booking needs.</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Book Your Trip Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;