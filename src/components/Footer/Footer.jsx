import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";

const Footer = ( { className, children } ) => {
  return (
    <div className={`footer ${className}`}>
      <div className="footer-row">
        {
          children
      }

        
      </div>
      <div className="footer-row">
        <div className="footer-header">
          <h1>MIRO</h1>
          <h1>SOUNDS</h1>
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
