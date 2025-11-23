import React from "react";
import "./About.css";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import ReactLenis from "lenis/react";

import Transition from "../../components/Transition/Transition";

const About = () => {
  return (
    <ReactLenis root>
      <div className="page about">


        <section className="about-me-copy">
          <div className="about-me-copy-wrapper">
            <AnimatedCopy animateOnScroll={true} tag="h3">
              We are the live entertainment curators, connectors and creators of unforgettable experiences.
            </AnimatedCopy>

         
          </div>
        </section>

        <section className="services">
          <div className="services-col">
            <div className="services-banner">
              <img src="/about/rory.jpg" alt="" />
            </div>
           
          </div>
          <div className="services-col">
            <h4>
            Led by founder Rory, Miro brings 15 years of expertise across music, events, sound curation, and live production. 
            </h4>
            <div className="services-list">

            
            <p>We’ve built the relationships and know-how to seamlessly connect you with exceptional artists and entertainment, anywhere in the world.</p>
            <p>
            Based in London - one of the world’s most inspiring music cities - we bring the sounds of the main stage, candlelit jazz club, underground gig or secret festival woodland to your event. From the familiar to the fresh, the refined to the raw, trust Miro to create that spark - the perfect pairing of sound and setting that turns good events into great ones.
            </p>
            </div>
            {/* <div className="services-list">
              <div className="service-list-row">
                <div className="service-list-col">
                  <h5>Music Consultation </h5>
                </div>
                <div className="service-list-col">
                  <p>
                    From first ideas to the last dance, we work with you to
                    understand your vision and curate the perfect soundscape.
                    Every moment is crafted with intention — ensuring the music
                    aligns with your event's atmosphere, purpose, and emotion.
                  </p>
                </div>
              </div>

              <div className="service-list-row">
                <div className="service-list-col">
                  <h5>Artist Selection</h5>
                </div>
                <div className="service-list-col">
                  <p>
                    Getting the music just right isn't just our passion — it's our purpose. We bring the sounds of the main stage, smokey jazz club, underground gig or the festival woodland to your event. From the familiar to the fresh, we curate artists who elevate every moment.
                  </p>
                </div>
              </div>

              <div className="service-list-row">
                <div className="service-list-col">
                  <h5>Booking & Coordination</h5>
                </div>
                <div className="service-list-col">
                  <p>
                    We coordinate with artists,
                    manage logistics, and ensure seamless execution — so you can focus on enjoying your unforgettable event.
                  </p>
                </div>
              </div>

              <div className="service-list-row">
                <div className="service-list-col">
                  <h5>Onsite Management</h5>
                </div>
                <div className="service-list-col">
                  <p>
                    We handle everything behind the scenes, before, during and after the event: logistics, contracts, artist liaison and on-site management. So don’t just put on the party of the century…make sure you seriously enjoy it too!
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        

        <ContactForm />

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(About);
