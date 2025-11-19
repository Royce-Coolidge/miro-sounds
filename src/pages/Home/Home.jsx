import workList from "../../data/workList";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import AnimatedCopy from "../../components/AnimatedCopy/AnimatedCopy";
import Reviews from "../../components/Reviews/Reviews";
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
    setLoaderAnimating(false);
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
              <AnimatedCopy tag="h1" animateOnScroll={false} delay={0.7}>
              Miro
            </AnimatedCopy>
            <AnimatedCopy tag="h1" animateOnScroll={false} delay={0.8}>
              sounds
            </AnimatedCopy>
            <div className="scroll-indicator-container">
            <Link to="/#sticky-titles"
              className="scroll-indicator">
            </Link>
            </div>
            </div>
             
        </section>

        <section id="sticky-titles" ref={stickyTitlesRef} className="sticky-titles">
          <div className="sticky-titles-nav">
            <p className="primary sm">About Me</p>
            <p className="primary sm">Let’s Connect</p>
          </div>
          <div className="sticky-titles-footer">
            <p className="primary sm">Miro Sounds curates and delivers epic live entertainment.</p>
            <p className="primary sm"></p>
          </div>
          <h2 ref={(el) => (titlesRef.current[0] = el)}>
          Unforgettable events are made by exceptional music.          </h2>
          <h2 ref={(el) => (titlesRef.current[1] = el)}>
          From first ideas to the last dance...
          </h2>
          <h2 ref={(el) => (titlesRef.current[2] = el)}>
          getting the music just right isn’t just our passion - it’s our purpose.
          </h2>
        </section>

        <section ref={stickyWorkHeaderRef} className="sticky-work-header">
          <AnimatedCopy tag="h1" animateOnScroll="true">
            Miro Sounds
          </AnimatedCopy>
        </section>

        <section ref={homeWorkRef} className="home-work">
          <div className="home-work-list">
            {workItems.map((work, index) => (
              <Link
                to="/sample-project"
                key={work.id}
                className="home-work-item"
              >
                <p className="primary sm">{`${String(index + 1).padStart(
                  2,
                  "0"
                )} - ${String(workItems.length).padStart(2, "0")}`}</p>
                <h3>{work.title}</h3>
                
                <h4>{work.subtitle}</h4>
                <p>{work.description}</p>
              </Link>
            ))}
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
