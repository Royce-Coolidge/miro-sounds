import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const email = "rory@mirosounds.com";

  React.useEffect(() => {
    // Detect if device supports hover (typically desktop)
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches || window.innerWidth < 900);
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
    <div className="contact-form">
      <div className="contact-form-row">
        <div className="contact-form-row-copy-item">
          <p className="primary sm">Make your night unforgettable</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">(contact — 07)</p>
        </div>
        <div className="contact-form-row-copy-item">
          <p className="primary sm">&copy; 2025</p>
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-col">
          <div className="contact-form-header">
            <h3> Get in Touch</h3>

            <p>
            Send us a brief, give us a call, or we can come and say Hello.
            </p>
          </div>

          
        </div>

        <div className="contact-form-col">
         
          <div className="email-container">
            {isMobile ? (
              <a href={`mailto:${email}`} className="email-link">
                <h3>{email}</h3>
              </a>
            ) : (
              <h3
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
            </h3>
            )}
          </div>
        </div>
      </div>
      <div className="contact-form-row">
        <div className="contact-form-availability">
            <p className="primary sm">Available for Summer 2026</p>
            <p className="primary sm">Clients worldwide</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
