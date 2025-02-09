import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>Phone Number: (123) 456-7890</p>
          <p>Email: <a href="mailto:info@example.com">info@example.com</a></p>
          <p>Address: 123 Main St, City, State, ZIP</p>
        </div>

        <div className="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="social-media">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
            <li><a href="https://linkedin.com">LinkedIn</a></li>
          </ul>
        </div>

        <div className="newsletter">
          <h3>Newsletter Signup</h3>
          <p>Subscribe to our newsletter for updates and offers.</p>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </div>
      </div>

      <div className="copyright">
        <p>© 2023 Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;