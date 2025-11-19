import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";

const Footer = ( { className } ) => {
  return (
    <div className={`footer ${className}`}>
      <div className="footer-row">
      

        
      </div>
      <div className="footer-row">
        <div className="footer-header">
          <h1>MIRO</h1>
          <h1>SOUNDS</h1>
        </div>

        <div className="footer-copyright-line">
          <p className="primary sm">&copy; MIRO SOUNDS 2025</p>
          <p className="primary sm">Website by ROWLEY THOMPSON</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
