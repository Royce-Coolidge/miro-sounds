import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";
import AnimatedCopy from "../AnimatedCopy/AnimatedCopy";

const Footer = ( { className, children } ) => {
  return (
    <div className={`footer ${className}`}>
      <div className="footer-row">
        {
          children
      }

        
      </div>
      <div className="footer-row">
        <div className="hero-header">
          <AnimatedCopy animateOnScroll={false} delay={0.2} tag="h1">MIRO</AnimatedCopy>
          <AnimatedCopy animateOnScroll={false} delay={0.2} tag="h1">SOUNDS</AnimatedCopy>
        </div>

        <div className="footer-copyright-line">
          <p className="primary sm">&copy; MIRO SOUNDS 2025</p>
          <span className="primary sm"><a className="primary sm" href="https://www.instagram.com/miro.sounds/" target="_blank" rel="noopener noreferrer">Instagram</a></span>
        </div> 
      </div>
    </div>
  );
};

export default Footer;
