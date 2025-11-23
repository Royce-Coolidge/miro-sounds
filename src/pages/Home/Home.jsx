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

let isInitialLoad = true;
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

import Transition from "../../components/Transition/Transition";
import BackgroundVideo from "../../components/BackgroundVideo/BackgroundVideo";
import Preloader from "../../components/Preloader/Preloader";
import { useLenis } from "lenis/react";


const Home = () => {
  const workItems = Array.isArray(workList) ? workList : [];
  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const stickyWorkHeaderRef = useRef(null);
  const homeWorkRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  

  const handleVideoLoaded = () => {
    setLoaderAnimating(true);
  };

  const handlePreloaderComplete = () => {
    setShowPreloader(false);

  
  };

  
  
  
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
        
        <section className="hero">
        
          <BackgroundVideo onVideoLoaded={handleVideoLoaded} />

          <div className="hero-header">
      <h1>
              Miro
            </h1>
            
            <h1>
              sounds
            </h1>
            
          </div>
          <div className="mobile-scroll-indicator">
            <Link to="/#sticky-titles">
               <svg
               aria-hidden
               stroke="currentColor"
               width="43"
               height="15"
               viewBox="0 0 43 15"
             >
               <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
             </svg>
            </Link>
            </div>
             
        </section>
        

        <section id="sticky-titles" ref={stickyTitlesRef} className="sticky-titles">
          <div className="sticky-titles-nav">
          <p className="primary sm">About Us </p>
          <Link to="/contact" className="primary sm">Let’s Connect</Link>
          </div>
          <div className="sticky-titles-footer">
            <p className="primary sm">Miro Sounds curates and delivers epic live entertainment.</p>
            <p className="primary sm"></p>
          </div>
          <h2 ref={(el) => (titlesRef.current[0] = el)}>
            FROM FIRST IDEAS TO THE LAST DANCE...
            <br></br>
            WE DESIGN & DELIVER THE PERFECT ENTERTAINMENT


        </h2>
          <h2 ref={(el) => (titlesRef.current[1] = el)}>
          </h2>
       
        </section>

        {/* <section ref={stickyWorkHeaderRef} className="sticky-work-header">
          <AnimatedCopy tag="h1" animateOnScroll="true">
            Miro Sounds
          </AnimatedCopy>
        </section> */}

        <section ref={homeWorkRef} className="home-work">
          <div className="home-work-list">
           
              <div
                className="home-work-item"
              >
             
                <h3>How We Work</h3>
                
                <h4>Exceptional music & entertainment curated for any event</h4>
                <p>For individuals, event planners and brands seeking bespoke support for private parties, weddings and live experiences; we curate elevated music to soundtrack your celebrations.</p>
                <p>
                Fom high-energy party bands, DJ sets, big names, best-kept secrets to background tunes, headline acts or day two hangover healers. We’ll source and coordinate your dream line-up. Jazz quartets, Irish trad, Brazilian beats or disco highlife; all genres across all venue styles; from luxury marquees, candlelit gardens, rooftops or beach clubs - we cover it all..
                </p>
                <p>
                And if you want to go beyond music, we also love to help add extra spice with further entertainment like comedy, art, speakers and more.
                </p>
                <h4>
                Tell us your vision and we’ll take it from there
                </h4>
            </div>
            <div className="home-work-item"></div>
           
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

        <ContactForm />
        <Footer className="home-footer" />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
