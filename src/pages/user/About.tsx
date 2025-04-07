import  React  from "react"
import { MapPin, Ticket, CreditCard, Star, Heart, MessageSquare, UserPlus, Headphones, Percent, Award } from 'lucide-react';
import Header from "../../components/user/layouts/Header";

const About: React.FC = () =>  {
  return (
    <>
    <Header />
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About BusQuik</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in comfortable and reliable bus travel across the country.
          </p>
        </div>

        {/* Company Overview */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2025, BusQuik has grown to become one of the leading bus booking platforms,
                  connecting thousands of travelers with reliable bus services across multiple cities.
                </p>
                <p className="text-gray-600">
                  We're committed to making bus travel simple, comfortable, and accessible for everyone
                  through innovative technology and exceptional customer service.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern bus on road"
                  className="rounded-lg shadow-md w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Book Your Journey in Minutes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Ticket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search Routes</h3>
              <p className="text-gray-600">Enter your destination and travel date</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Choose Bus</h3>
              <p className="text-gray-600">Select from premium operators</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Pay safely with multiple options</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Travel Happy</h3>
              <p className="text-gray-600">Enjoy your comfortable journey</p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="mb-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Join Our Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Travel Forums</h3>
              <p className="text-gray-600">
                Connect with fellow travelers, share experiences, and get travel tips from our active community.
              </p>
            </div>
            <div className="text-center">
              <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loyalty Program</h3>
              <p className="text-gray-600">
                Earn points on every booking and enjoy exclusive member benefits and special discounts.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Travel Rewards</h3>
              <p className="text-gray-600">
                Get rewarded for being an active community member with special perks and priority booking.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MapPin className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nationwide Coverage</h3>
            <p className="text-gray-600">
              Access to bus routes covering over 1000+ destinations across the country.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Headphones className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Round-the-clock customer support to assist you with your booking needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Percent className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Guaranteed best fares with regular discounts and seasonal offers.
            </p>
          </div>
        </div>

       
      </div>
    </div>
    </>
  );
}

export default About;