import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {currentYear} Ha Ngoc Long</p>
    </footer>
  );
};

export default Footer;