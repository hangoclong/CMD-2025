import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="app-header">
    <h1>{title}</h1>
  </header>
);

export default Header;