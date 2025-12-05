import { useState, useEffect, useRef } from "react";
import "./Preloader.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

/**
 * Preloader component with animated loading sequence
 * Displays counter animation, logo reveal, and transition
 *
 * MOBILE BEHAVIOR:
 * - Animation pauses before final transition
 * - User MUST click "Enter Site" button to complete animation
 * - This guarantees a user gesture for video unlock
 *
 * DESKTOP BEHAVIOR:
 * - Auto-completes after GSAP animation finishes
 * - No button shown, seamless transition
 *
 * @param {boolean} showPreloader - Whether to show the preloader
 * @param {function} setLoaderAnimating - Callback to set loader animation state
 * @param {function} onComplete - Callback when preloader animation completes
 * @param {function} onEnterClick - Optional callback for mobile "Enter Site" button click
 */
export default function Preloader({ showPreloader, setLoaderAnimating, onComplete, onEnterClick }) {
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef(null);

  // Detect mobile on mount

  console.log("Preloader render - isMobile:", isMobile);
  console.log("Preloader render - showButton:", showButton);
  console.log("Preloader render - showPreloader:", showPreloader);
  console.log("Preloader render - onEnterClick:", !!onEnterClick);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1000px)").matches;
    setIsMobile(mobile);
  }, []);

  // Show button immediately on mobile, after delay on desktop (if onEnterClick provided)
  useEffect(() => {
    if (showPreloader && onEnterClick) {
      if (isMobile) {
        // Show button immediately on mobile - don't make users wait
        setShowButton(true);
      } else {
        // On desktop with onEnterClick, show after delay (for testing)
        const timer = setTimeout(() => {
          setShowButton(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    } else {
      setShowButton(false);
    }
  }, [showPreloader, onEnterClick, isMobile]);

  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    if (showPreloader) {
      const mobile = window.matchMedia("(max-width: 1000px)").matches;

      // Store timeline reference so button can resume it
      timelineRef.current = tl;

      // Failsafe: ensure preloader completes even if animation fails
      // Only on desktop - mobile waits for button click
      let failsafeTimeout;
      if (!mobile) {
        failsafeTimeout = setTimeout(() => {
          console.warn("Preloader failsafe triggered");
          setLoaderAnimating(false);
          onComplete();
        }, 10000); // 10 second max
      }

      // Clear failsafe when animation completes normally
      tl.eventCallback("onComplete", () => {
        if (failsafeTimeout) {
          clearTimeout(failsafeTimeout);
        }
      });

      setLoaderAnimating(true);
      const counts = document.querySelectorAll(".count");

      counts.forEach((count, index) => {
        const digits = count.querySelectorAll(".digit h1");

        tl.to(
          digits,
          {
            y: "0%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1
        );

        if (index < counts.length) {
          tl.to(
            digits,
            {
              y: "-100%",
              duration: 1,
              stagger: 0.075,
            },
            index * 1 + 1
          );
        }
      });


      tl.to(
        ".word h1",
        {
          y: "0%",
          duration: 1,
        },
        "<"
      );


      // On mobile, add a pause point before final transition
      // User clicking button will resume from here
      if (mobile) {
        tl.addPause();
      }


      tl.to("#word-1 h1", {
        y: "100%",
        duration: 1,
        delay: 0.3,
      });


      tl.to(
        "#word-2 h1",
        {
          y: "-100%",
          duration: 1,
          onStart: () => {

            setLoaderAnimating(false);
            onComplete();
          },
        },
        "<"
      );


      tl.to(
        ".block",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          stagger: 0.1,
          delay: 0.75,
          onStart: () => {

            // setLoaderAnimating(false);
            // onComplete();
            gsap.to(".hero", { scale: 1, duration: 2, ease: "hop" });
            gsap.set(".loader", { zIndex: -1 });
          },
        },
        "<"
      );
    }
  }, [showPreloader, onComplete, setLoaderAnimating]);

  // Handle button click - resumes animation and calls parent handler
  const handleButtonClick = () => {
    // Resume animation to complete the final transition
    if (timelineRef.current) {
      timelineRef.current.resume();
    }

    // Call parent's click handler if provided (for video unlock)
    if (onEnterClick) {
      onEnterClick();
    }
  };

  if (!showPreloader) {
    return null;
  }

  return (
    <div className="loader">
      <div className="overlay">
        <div className="block"></div>
        <div className="block"></div>
      </div>
      <div className="intro-logo">
        <div className="word" id="word-1">
          <h1>
            <span>Miro</span>
          </h1>
        </div>
        <div className="word" id="word-2">
          <h1>Sounds</h1>
        </div>
      </div>

      <div className="counter">
        <div className="count">
          <div className="digit">
            <h1>0</h1>
          </div>
          <div className="digit">
            <h1>0</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>2</h1>
          </div>
          <div className="digit">
            <h1>7</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>6</h1>
          </div>
          <div className="digit">
            <h1>5</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>9</h1>
          </div>
          <div className="digit">
            <h1>8</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>9</h1>
          </div>
          <div className="digit">
            <h1>9</h1>
          </div>
        </div>
      </div>

      {/* Mobile-only "Enter Site" button - resumes animation, unlocks video, completes preloader */}
      {onEnterClick && showButton && (
        <button
          className="preloader-enter-button"
          onClick={handleButtonClick}
          aria-label="Enter site"
        >
          Enter Miro sounds
        </button>
      )}
    </div>
  );
}
