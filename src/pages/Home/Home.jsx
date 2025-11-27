import workList from "../../data/workList";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import ReactLenis from "lenis/react";
import MiroIcon from "../../assets/miro-marron.svg";

let isInitialLoad = true;
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

import Transition from "../../components/Transition/Transition";
import BackgroundVideo from "../../components/BackgroundVideo/BackgroundVideo";
import Preloader from "../../components/Preloader/Preloader";
import { useLenis } from "lenis/react";


const Home = () => {

  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const stickyWorkHeaderRef = useRef(null);
  const homeWorkRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const [status, setStatus] = useState('idle');
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(true);
  const [mobileScrollIndicatorHidden, setMobileScrollIndicatorHidden] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
      setStatus('entered');
    };
  }, []);


  const handleVideoLoaded = () => {
    setLoaderAnimating(true);
  };

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setStatus('entered');
  };

  const handleScrollClick = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById('sticky-titles');
    if (targetElement && lenis) {
      lenis.scrollTo(targetElement, {
        offset: 0,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
    setMobileScrollIndicatorHidden(true);
    setScrollIndicatorHidden(false);
  };

  const VisuallyHidden = ({ children }) => (
    <span style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0
    }}>
      {children}
    </span>
  );




  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const stickySection = stickyTitlesRef.current;
    const titles = titlesRef.current.filter(Boolean);

    if (!stickySection || titles.length !== 3) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    gsap.set(titles[0], { opacity: 1, scale: 1 });
    gsap.set(titles[1], { opacity: 0, scale: 0.75 });
    gsap.set(titles[2], { opacity: 0, scale: 0.75 });

    const pinTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        scrub: 0.5,
      },
    });

    masterTimeline
      .to(
        titles[0],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        1
      )

      .to(
        titles[1],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        1.25
      );

    masterTimeline
      .to(
        titles[1],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        2.5
      )

      .to(
        titles[2],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        2.75
      );

    const workHeaderSection = stickyWorkHeaderRef.current;
    const homeWorkSection = homeWorkRef.current;

    let workHeaderPinTrigger;
    if (workHeaderSection && homeWorkSection) {
      setScrollIndicatorHidden(true);
      workHeaderPinTrigger = ScrollTrigger.create({
        trigger: workHeaderSection,
        start: "top top",
        endTrigger: homeWorkSection,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
     
    }

    return () => {
      pinTrigger.kill();
      if (workHeaderPinTrigger) {
        workHeaderPinTrigger.kill();
      }
      if (masterTimeline.scrollTrigger) {
        masterTimeline.scrollTrigger.kill();
      }
      masterTimeline.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ReactLenis root>
      {showPreloader && (
        <Preloader
          showPreloader={showPreloader}
          setLoaderAnimating={setLoaderAnimating}
          onComplete={handlePreloaderComplete}
        />
      )}

      <div className="page home">

        <section id="hero" className="hero">

          <BackgroundVideo onVideoLoaded={handleVideoLoaded} />

          <div className="hero-header">
            <AnimatedCopy tag="h1" animateOnScroll="false">
              Miro
            </AnimatedCopy>

            <AnimatedCopy tag="h1" animateOnScroll="true">
              sounds
            </AnimatedCopy>

          </div>
          <Link
            to="/#sticky-titles"
            className="scrollIndicator"
            data-status={status}
            data-hidden={scrollIndicatorHidden}
            onClick={handleScrollClick}
          >
            <VisuallyHidden>Scroll to projects</VisuallyHidden>
          </Link>
          <Link
            to="/#sticky-titles"
            className="mobileScrollIndicator"
            data-status={status}
            data-hidden={mobileScrollIndicatorHidden}
            onClick={handleScrollClick}
          >
            <VisuallyHidden>Scroll to projects</VisuallyHidden>
            <svg
              aria-hidden
              stroke="currentColor"
              width="43"
              height="25"
              viewBox="0 0 43 15"
            >
              <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
            </svg>
          </Link>

        </section>


        <section id="sticky-titles" ref={stickyTitlesRef} className="sticky-titles">
          <div className="sticky-titles-nav">
            <a
              href="#how-we-work"
              className="primary sm"
              onClick={(e) => {
                e.preventDefault();
                const targetElement = document.getElementById('about');
                if (targetElement && lenis) {
                  lenis.scrollTo(targetElement, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                  });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              About Me
            </a>
            <a
              href="#contact"
              className="primary sm"
              onClick={(e) => {
                e.preventDefault();
                const targetElement = document.getElementById('contact');
                if (targetElement && lenis) {
                  lenis.scrollTo(targetElement, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                  });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Let's Connect
            </a>
          </div>
          <div className="sticky-titles-footer">
            <p className="primary sm">Miro Sounds curates and delivers epic live entertainment.</p>
            <p className="primary sm"></p>
          </div>
          <h2 ref={(el) => (titlesRef.current[0] = el)}>
            From first ideas to...
          </h2>
          <h2 ref={(el) => (titlesRef.current[1] = el)}>
            To the last dance...
          </h2>
          <h2 ref={(el) => (titlesRef.current[2] = el)}>
            WE DESIGN & DELIVER THE PERFECT ENTERTAINMENT          </h2>
        </section>

        <section ref={stickyWorkHeaderRef} className="sticky-work-header">
          <AnimatedCopy tag="h1" animateOnScroll="true" delay={!showPreloader ? 0.5 : 0}>
            Miro Sounds
          </AnimatedCopy>
        </section>

        <section id="how-we-work" ref={homeWorkRef} className="home-work">
          <div className="home-work-list">

            <div
              className="home-work-item"
            >

              <h3>How We Work</h3>

              <h4>Exceptional music & entertainment curated for any event</h4>
              <p>For individuals, event planners and brands seeking bespoke support for private parties, weddings and live experiences, we curate elevated music to soundtrack your celebrations.</p>
              <p>
                High-energy party bands, DJ sets, big names or best-kept secrets. Background tunes, headline moments or day-two hangover healers - we’ll source and coordinate your dream line-up. From jazz quartets and Irish trios to Brazilian beats and disco highlife, across luxury marquees, candlelit gardens, rooftops and beach clubs.
              </p>
              <p>
                And if you want to go beyond music, we also love to help add extra spice with further entertainment like comedy, art, speakers and more.
              </p>
            </div>
            <div className="home-work-item">

              <img src={MiroIcon} alt="Miro Icon" className="miro-icon" width={10} height={10} />
              <h3>Tell us your vision and we’ll take it from there</h3>
              <p> Whether you have a clear idea or just a feeling you want to capture, Miro supports from concept stage to final details.</p>
              <p>We fine-tune every element - genre mix, set times, sound setup, venue acoustics, while handling all behind-the-scenes work; logistics, contracts, production, artist liaison and on-site management. Making sure it all flows seamlessly.</p>
            </div>
      
          </div>
          <div id="about" className="home-work-item">
            <h3>About Us</h3>
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
           
            
          </div>
        </section>
          </div>
          
        </section>

        {/* <Reviews /> */}

        <section className="hobbies">
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              Music Consultation
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              Artist Selection
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              Booking
            </AnimatedCopy>
          </div>
          <div className="hobby">
            <AnimatedCopy tag="h4" animateOnScroll={true}>
              Onsite Management
            </AnimatedCopy>
          </div>
        </section>

        <ContactForm id="contact" />
        <Footer className="home-footer" />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
