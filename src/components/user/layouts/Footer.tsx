import React from 'react';

const Footer: React.FC = () => {
  return (
    //style={styles.footer}
    <footer >
      <p>&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
    </footer>
  );
};

// const styles = {
//   footer: {
//     backgroundColor: '#f8f9fa',
//     color: '#6c757d',
//     textAlign: 'center',
//     padding: '1rem',
//     marginTop: 'auto',
//   },
// };

export default Footer;
