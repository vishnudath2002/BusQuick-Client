import React from 'react';
import HeroSection from '../../components/user/landing/HeroSection';
import FeaturesSection from '../../components/user/landing/FeaturesSection';
import Header from '../../components/user/layouts/Header';
import Footer from '../../components/user/layouts/Footer';
import SearchForm from '../../components/user/landing/SearchForm';


const HomePage: React.FC = () => {

  
  return (
    <div>
      <Header />
      <HeroSection />
      <SearchForm />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
