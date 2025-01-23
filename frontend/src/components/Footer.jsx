// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-4 text-center">
      <p>&copy; {new Date().getFullYear()} JobReady. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
