// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 py-6 text-center text-xs text-theme-muted/50">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Odds of the Gods. A purely fictional experience created for demonstration purposes.</p>
        <p>All wagers are simulated and have no real-world value.</p>
      </div>
    </footer>
  );
};

export default Footer;
