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
  const videoUnlockedRef = useRef(false); // Track if video has been unlocked via user interaction
  const interactionListenersAttached = useRef(false); // Track if interaction listeners are attached
  const preloaderCompleteRef = useRef(false); // Track if preloader has completed

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

  // Control Lenis scroll based on preloader animation state
  useEffect(() => {
    if (lenis) {
      if (showPreloader) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  const handleVideoLoaded = () => {
    setLoaderAnimating(true);
  };

  const handleVideoError = (error) => {
    console.error("Video error:", error);
  };

  /**
   * CRITICAL FIX: Unlock video on ANY user interaction on mobile
   * This ensures video can play even if preloader auto-completes before user clicks "Enter Site"
   * Without this, mobile users who don't click the button have permanently paused video
   */
  useEffect(() => {
    // Only run on mobile devices (matching the preloader button media query)
    const isMobile = window.matchMedia("(max-width: 1000px)").matches;
    if (!isMobile || interactionListenersAttached.current) return;

    console.log('[Mobile Video Fix] Setting up interaction listeners for video unlock');

    const unlockVideoOnInteraction = async (event) => {
      if (videoUnlockedRef.current || !videoRef.current) return;

      console.log('[Mobile Video Fix] User interaction detected:', event.type);
      console.log('[Mobile Video Fix] Attempting to unlock video...');

      // Unlock the video during this user interaction
      if (typeof videoRef.current.unlock === 'function') {
        const success = await videoRef.current.unlock();
        if (success) {
          videoUnlockedRef.current = true;
          console.log('[Mobile Video Fix] ✓ Video unlocked successfully');

          // If preloader has already completed, try to play now
          if (preloaderCompleteRef.current && videoRef.current.play) {
            console.log('[Mobile Video Fix] Preloader done, attempting immediate playback');
            videoRef.current.play().catch(err => {
              console.warn('[Mobile Video Fix] Immediate play failed:', err);
            });
          }
        } else {
          console.warn('[Mobile Video Fix] ✗ Video unlock returned false');
        }
      } else {
        console.warn('[Mobile Video Fix] ✗ unlock() method not available on videoRef');
      }
    };

    // Attach listeners for various interaction types
    // Use multiple events to maximize chances of catching first interaction
    const events = ['touchstart', 'touchend', 'click', 'scroll', 'touchmove'];
    events.forEach(event => {
      window.addEventListener(event, unlockVideoOnInteraction, { once: true, passive: true });
    });
    interactionListenersAttached.current = true;

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, unlockVideoOnInteraction);
      });
    };
  }, []); // Run once on mount - don't re-run to avoid duplicate listeners

  /**
   * Handles "Enter Site" button click on mobile
   * Unlocks video playback and completes preloader
   */
  const handleEnterSiteClick = async () => {
    if (!videoUnlockedRef.current && videoRef.current) {
      // Unlock video during user interaction (required for mobile autoplay)
      if (typeof videoRef.current.unlock === 'function') {
        await videoRef.current.unlock();
        videoUnlockedRef.current = true;
      }
    }

    // Complete preloader - this will trigger video playback
    handlePreloaderComplete();
  };

  /**
   * Handles preloader animation completion
   * Plays video if it has been unlocked (via "Enter Site" button or interaction on mobile)
   * CRITICAL: Must set loaderAnimating to false to enable scroll
   */
  const handlePreloaderComplete = () => {
    preloaderCompleteRef.current = true; // Mark preloader as complete
    setShowPreloader(false);
    setLoaderAnimating(false); // CRITICAL: Enable scroll by stopping loader animation
    setStatus('entered');
    setScrollIndicatorHidden(false);

    console.log('[Preloader] Complete - attempting video playback');
    console.log('[Preloader] Video unlocked?', videoUnlockedRef.current);

    // Play video with delay to ensure smooth transition
    if (videoRef.current && typeof videoRef.current.play === 'function') {
      setTimeout(async () => {
        try {
          await videoRef.current.play();
          console.log('[Video] ✓ Playback started successfully');
        } catch (error) {
          console.warn("[Video] ✗ Initial playback failed:", error);
          console.log('[Video] Setting up retry mechanism...');
          // On mobile: If video unlock happened via interaction, this should succeed
          // On desktop: Should work without unlock
          // If it fails, set up retry on next interaction
          setupVideoPlaybackRetry();
        }
      }, 100);
    }
  };

  /**
   * FALLBACK: Retry video playback on next user interaction if initial play failed
   * CRITICAL: Must unlock video DURING interaction, then play it
   */
  const setupVideoPlaybackRetry = () => {
    const isMobile = window.matchMedia("(max-width: 1000px)").matches;
    if (!isMobile) return;

    console.log('[Video Retry] Setting up retry on next interaction');

    const retryPlay = async () => {
      if (!videoRef.current) return;

      console.log('[Video Retry] User interacted - attempting unlock and play');

      try {
        // CRITICAL: Must unlock during this interaction if not already unlocked
        if (!videoUnlockedRef.current && typeof videoRef.current.unlock === 'function') {
          console.log('[Video Retry] Unlocking video...');
          await videoRef.current.unlock();
          videoUnlockedRef.current = true;
        }

        // Now play the video
        await videoRef.current.play();
        console.log('[Video Retry] Playback started successfully on interaction');
      } catch (error) {
        console.warn('[Video Retry] Playback still failed:', error);
      }
    };

    const events = ['touchstart', 'scroll', 'click', 'touchend'];
    events.forEach(event => {
      window.addEventListener(event, retryPlay, { once: true, passive: true });
    });
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
          duration: 1,
          ease: "power2.out",
        },
        1
      )

      .to(
        titles[1],
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.in",
        },
        0.5
      );

    masterTimeline
      .to(
        titles[1],
        {
          opacity: 0,
          scale: 0.75,
          duration: 1,
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
          onEnterClick={handleEnterSiteClick}
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
            <AnimatedCopy tag="h1" animateOnScroll={false} delay={7.25}>
              Miro
            </AnimatedCopy>
            <AnimatedCopy tag="h1" animateOnScroll={false} delay={7.25}>
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
                Big names, hidden gems, live bands or epic DJ sets. Background tunes or headline moments - we’ll source and coordinate your dream line-up. Any style - from timeless classics to disco house bangers, jazz quartets to brass ensembles, Brazilian grooves to rhythm & blues. Across any setting, from luxury marquees to candlelit rooftops.
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
