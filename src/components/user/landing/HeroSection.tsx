import React from 'react';
import { useSelector } from 'react-redux';


const HeroSection: React.FC = () => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const user = useSelector((state: any) => state.auth.isLoggedIn);

  return (
    <section style={styles.hero}>
     <h1 style={styles.title}>Welcome to { user ? 'Home Page':'Langing Page' }</h1>
     

      <p style={styles.subtitle}>Travel Smarter, Faster, Easier with BusQuik.</p>
       { user ? null : <button style={styles.ctaButton}>Get Started</button> } 
    </section>
  );
};

const styles = {
  hero: {
    textAlign: 'center' as const,
    padding: '5rem 2rem',
    backgroundColor: '#007074',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
  },
  ctaButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HeroSection;
