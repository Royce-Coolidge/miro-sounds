import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import ReactLenis from "lenis/react";
import { useLenis } from "lenis/react";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/Transition/Transition";
import BackgroundVideo from "../../components/BackgroundVideo/BackgroundVideo";
import Preloader from "../../components/Preloader/Preloader";

import MiroIcon from "../../assets/miro-tab.png";
import "./Home.css";

// Track initial page load for preloader
let isInitialLoad = true;

// Register GSAP plugins and custom easing
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const Home = () => {
  // Refs
  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const stickyWorkHeaderRef = useRef(null);
  const homeWorkRef = useRef(null);
  const videoRef = useRef(null);

  // State
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const [status, setStatus] = useState('idle');
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(true);
  const [mobileScrollIndicatorHidden, setMobileScrollIndicatorHidden] = useState(false);

  const lenis = useLenis();

  // Reset initial load flag on component unmount
  useEffect(() => {
    return () => {
      isInitialLoad = false;
      setStatus('entered');
    };
  }, []);

  /**
   * Mobile autoplay unlock - enables video playback on first user interaction
   * Required for iOS and some Android devices that block autoplay
   */
  useEffect(() => {
    const unlockAutoplay = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Silently fail - video will play after preloader
        });
      }
    };

    // Listen for any user interaction to unlock playback
    document.addEventListener('touchstart', unlockAutoplay, { once: true });


    document.addEventListener('click', unlockAutoplay, { once: true });

    return () => {
      document.removeEventListener('touchstart', unlockAutoplay);
      document.removeEventListener('click', unlockAutoplay);
    };
  }, []);

  // // Control Lenis scroll based on preloader animation state
  // useEffect(() => {
  //   if (lenis) {
  //     if (loaderAnimating) {
  //       lenis.stop();
  //     } else {
  //       lenis.start();
  //     }
  //   }
  // }, [lenis, loaderAnimating]);

  const handleVideoLoaded = () => {
    setLoaderAnimating(true);
  };

  const handleVideoError = (error) => {
    console.error("Video error:", error);
  };
  
const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setStatus('entered');
    setScrollIndicatorHidden(false);

    // Attempt video playback without blocking (fire-and-forget)
    // Mobile browsers often block autoplay, so we don't await
    if (videoRef.current) {
      // Use setTimeout to ensure state updates aren't blocked
      setTimeout(() => {
        videoRef.current.play().catch((error) => {
          console.warn("Video playback failed (expected on mobile):", error);
        });
      }, 100);
    }
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
      lenis.start();
      setScrollIndicatorHidden(false);
      setMobileScrollIndicatorHidden(true);
    }
  };

  // Accessibility helper component for screen readers
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

  // Setup GSAP ScrollTrigger animations for sticky titles and work sections
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const stickySection = stickyTitlesRef.current;
    const titles = titlesRef.current.filter(Boolean);

    if (!stickySection || titles.length !== 2) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    gsap.set(titles[0], { opacity: 1, scale: 1 });
    gsap.set(titles[1], { opacity: 0, scale: 0.75 });
    gsap.set(titles[2], { opacity: 0, scale: 0.75 });

    const pinTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: `+=${window.innerHeight * 2}`,
        scrub: 0.5,
      },
    });

    masterTimeline
      .to(
        titles[0],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.2,
          ease: "power2.out",
        },
        1
      )

      .to(
        titles[1],
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
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
          duration: 0.2,
          ease: "power2.out",
        },
        2.5
      )

      

    const workHeaderSection = stickyWorkHeaderRef.current;
    const homeWorkSection = homeWorkRef.current;

    let workHeaderPinTrigger;
    if (workHeaderSection && homeWorkSection) {
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
        <div className="hero-header-2">
          <h5>
          Curating Outstanding Music <br /> For Unforgettable Events
          </h5>
          </div>
        <section id="hero" className="hero">
      
          <BackgroundVideo ref={videoRef} onVideoLoaded={handleVideoLoaded}
            onVideoError={handleVideoError} />

          <div className="hero-header">
            <AnimatedCopy tag="h1" animateOnScroll="true">
              Miro
            </AnimatedCopy>
            <AnimatedCopy tag="h1" animateOnScroll="true">
              sounds
            </AnimatedCopy>
          </div>

          
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
            
          </div>
          <div className="sticky-titles-footer">
           
          </div>
          <h2 ref={(el) => (titlesRef.current[0] = el)}>
            From first ideas <br></br> to the last dance...
          </h2>
          <h2 ref={(el) => (titlesRef.current[1] = el)}>
            WE DESIGN & DELIVER THE PERFECT ENTERTAINMENT          </h2>
          
      
          
        </section>

        <section ref={stickyWorkHeaderRef} className="sticky-work-header">
          <AnimatedCopy tag="h1" animateOnScroll="true" delay={!showPreloader ? 0.5 : 0}>
            Miro Sounds
          </AnimatedCopy>
        </section>

        <section id="how-we-work" ref={homeWorkRef} className="home-work">
          <div className="home-work-list">
            <div className="home-work-item">
              <h3>How We Work</h3>
              <h4>Elevated music for exceptional events</h4>
              <p>For individuals, event planners and brands seeking bespoke support for private parties, exclusive weddings and live experiences.</p>
              <p>
                Big names, hidden gems, live bands or epic DJ sets. Background tunes or headline moments - we’ll source and coordinate your dream line-up. Any style - from timeless classics to disco house bangers, jazz quartets to Ska ensembles, Brazilian grooves to rhythm & blues. Across any setting, from luxury marquees to candlelit rooftops.
              </p>
              <p>
              And if you’re looking for more than music, we can bring extra energy with immersive performers, live art, comedy, speakers and more.
              </p>
               <img src={MiroIcon} alt="Miro Icon" className="miro-icon" width={10} height={10} />
            </div>

            <div className="home-work-item">
             
              <h4>Tell us your vision and we'll take it from there</h4>
              <p>Whether you have a clear idea or just a feeling you want to capture, Miro supports from concept stage to final details.</p>
              <p>We fine-tune every element - genre mix, set times, sound setup, venue acoustics, while handling all behind-the-scenes work; logistics, contracts, production, artist liaison and on-site management. Making sure it all flows seamlessly.</p>
            </div>
          </div>

        </section>

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

        <section id="about" className="home-work-2">
            <div className="home-work-list">

              <div className="home-work-item">
                <h3>About Us</h3>
                <h4>We are live entertainment curators, connectors and creators of unforgettable experiences.</h4>
                <section className="services">
                  <div className="services-col">
                    <div className="services-banner">
                      <img src="/about/rory.jpg" alt="Founder Rory" width={1000} height={100} className="services-banner-img" />
                    </div>
                  </div>
                  <div className="services-col">
                  
                  <div className="services-list">
                  <p>
                      Led by founder Rory, Miro brings 15 years of expertise across music, events, sound curation, and live production.
                    </p>
                      <p>We've built the relationships and know-how to seamlessly connect you with exceptional artists and entertainment, anywhere in the world.</p>
                      <p>
                        Based in London - one of the world's most inspiring music cities - we bring the sounds of the main stage, candlelit jazz club, underground gig or secret festival woodland to your event. From the familiar to the fresh, the refined to the raw, trust Miro to create that spark - the perfect pairing of sound and setting that turns good events into great ones.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

        <ContactForm id="contact" />
        <Footer className="home-footer" />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
