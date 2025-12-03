import React, { useState } from "react";
import "./ContactForm.css";


const ContactForm = ({ id }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const email = "rory@mirosounds.com";

  React.useEffect(() => {
    // Detect if device supports hover (typically desktop)
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches || window.innerWidth < 700);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCopy = async (e) => {
    if (isMobile) return; // Let mailto handle it on mobile

    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div id={id} className="contact-form">
      <div className="contact-form-row">
        <div className="contact-form-availability">
          <p className="primary sm"></p>
          <p className="primary sm"></p>
        </div>
      </div>
      <div className="contact-form-row">
      <div className="contact-form-header">
            <h3> Get in Touch</h3>

            
          </div>
      </div>

      <div className="contact-form-row">
       
        
        <div className="contact-form-col">

         
          
          <h4
            className="contact-form-phone">
            Call/WhatsApp{" "}
          </h4>
          <a
            className="contact-form-phone-link"
            href="tel:+447444840752"
            aria-label="Call or WhatsApp Miro Sounds at +44 7444 840752"
          >
            +447444840752
          </a>

        </div>
        <div className="contact-form-col">

<div className="email-container">
  <h4
    className="contact-form-phone"
  >Email{" "}</h4>
  <p
    className={`email-copy ${copied ? "copied" : ""}`}
    onClick={handleCopy}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCopy(e);
      }
    }}
  >
    {email}
    <span className="tooltip">
      {copied ? "Email copied!" : "Click to copy"}
    </span>
  </p>

          </div>
          



        </div>
        <div className="contact-form-col">
        
        
        <h4
            className="contact-form-phone">
           Instagram
          </h4>
          <a className="contact-form-phone-link" href="https://www.instagram.com/miro.sounds/" target="_blank" rel="noopener noreferrer">
          @miro.sounds</a>

        </div>


      </div>
      <div className="contact-form-row">
        <div className="contact-form-availability">
          <p className="primary sm"></p>
          <p className="primary sm"></p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
