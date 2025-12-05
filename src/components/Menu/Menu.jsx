import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Menu.css";

import { gsap } from "gsap";
import { useLenis } from "lenis/react";

const Menu = () => {
  // Navigation links configuration
  const menuLinks = [
    { path: "#about", label: "About Us" },
    { path: "#how-we-work", label: "How We Work" },
    { path: "#contact", label: "Get in Touch" }
  ];

  const mobileMenuLinks = [
    { path: "#hero", label: "Back to Top" },
    { path: "#contact", label: "Get in Touch" }
  ];

  // State and refs
  const lenis = useLenis();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Animation refs
  const menuAnimation = useRef();
  const menuLinksAnimation = useRef();
  const menuBarAnimation = useRef();
  const menuBarRef = useRef();

  // Scroll and navigation state
  const lastScrollY = useRef(0);
  const scrollPositionRef = useRef(0);
  const isNavigatingRef = useRef(false);

  /**
   * Toggle body scroll lock for mobile menu
   * Prevents background scrolling when menu is open
   * @param {boolean} disableScroll - true to lock, false to unlock
   * @param {boolean} skipRestore - if true, don't restore scroll position (for navigation)
   */
  const toggleBodyScroll = useCallback((disableScroll, skipRestore = false) => {
    if (disableScroll) {
      scrollPositionRef.current = window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = scrollPositionRef.current;
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");

      // Only restore scroll position if not navigating
      // When navigating, let Lenis handle the scroll to target
      if (!skipRestore) {
        window.scrollTo(0, scrollY);
      }
    }
  }, []);

  const toggleMenu = () => {
    const hamburger = document.querySelector(".hamburger-icon");
    if (hamburger) {
      hamburger.classList.toggle("active");
    }
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    toggleBodyScroll(newMenuState);
  };

  /**
   * Close menu and return a promise that resolves when animations complete
   * This ensures smooth scrolling happens after menu is fully closed
   * @param {boolean} skipScrollRestore - if true, don't restore scroll position (for navigation)
   */
  const closeMenu = useCallback((skipScrollRestore = false) => {
    return new Promise((resolve) => {
      if (isMenuOpen) {
        const hamburger = document.querySelector(".hamburger-icon");
        if (hamburger) {
          hamburger.classList.remove("active");
        }
        setIsMenuOpen(false);

        // Wait for menu animation to complete (1.25s max based on GSAP timeline)
        setTimeout(() => {
          toggleBodyScroll(false, skipScrollRestore);
          resolve();
        }, 1300); // Slightly longer than animation duration
      } else {
        resolve();
      }
    });
  }, [isMenuOpen, toggleBodyScroll]);

  /**
   * Handle navigation link clicks
   * Closes menu, waits for animations, then scrolls to target
   * Handles edge cases: rapid clicks, missing elements, Lenis unavailable
   */
  const handleLinkClick = useCallback(async (e, path) => {
    // Prevent rapid/multiple clicks
    if (isNavigatingRef.current) {
      e.preventDefault();
      return;
    }

    // Handle anchor links for single-page navigation
    if (path.startsWith('#')) {
      e.preventDefault();
      isNavigatingRef.current = true;

      try {
        const hash = path.substring(1);
        const targetElement = document.getElementById(hash);

        if (!targetElement) {
          console.warn(`Navigation target not found: #${hash}`);
          isNavigatingRef.current = false;
          return;
        }

        // Close menu and wait for animations, skip scroll restore
        await closeMenu(true);

        // Fallback to native scroll if Lenis unavailable
        if (!lenis) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          isNavigatingRef.current = false;
          return;
        }

        // Ensure Lenis is running and perform smooth scroll
        lenis.start();
        lenis.scrollTo(targetElement, {
          offset: 0,
          duration: 1.75,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isNavigatingRef.current = false;
          }
        });

        // Fallback: re-enable navigation after max duration
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 2000);

      } catch (error) {
        console.error("[Menu] Navigation error:", error);
        isNavigatingRef.current = false;
      }
    }
  }, [closeMenu, lenis]);

  /**
   * Handle logo click to scroll to top
   * Uses same pattern as handleLinkClick for consistency
   */
  const handleLogoClick = useCallback(async (e) => {
    e.preventDefault();

    // Prevent rapid clicks
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;

    try {
      // Close menu and wait for animations, skip scroll restore
      await closeMenu(true);

      // Fallback to native scroll if Lenis unavailable
      if (!lenis) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        isNavigatingRef.current = false;
        return;
      }

      // Ensure Lenis is running and scroll to top
      lenis.start();
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          isNavigatingRef.current = false;
        }
      });

      // Fallback timeout
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 2000);

    } catch (error) {
      console.error("Logo click navigation error:", error);
      isNavigatingRef.current = false;
    }
  }, [closeMenu, lenis]);

  // ============================================
  // Effects
  // ============================================

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Setup GSAP animations for menu
  useEffect(() => {
    gsap.set(".menu-link-item-holder", { y: 125 });

    menuAnimation.current = gsap.timeline({ paused: true }).to(".menu", {
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power4.inOut",
    });

    const createMenuBarAnimation = () => {
      if (menuBarAnimation.current) {
        menuBarAnimation.current.kill();
      }

      const heightValue =
        windowWidth < 1000 ? "calc(100% - 2.5em)" : "calc(100% - 4em)";

      menuBarAnimation.current = gsap
        .timeline({ paused: true })
        .to(".menu-bar", {
          duration: 1,
          height: heightValue,
          ease: "power4.inOut",
        });
    };

    createMenuBarAnimation();

    menuLinksAnimation.current = gsap
      .timeline({ paused: true })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 1.25,
        stagger: 0.075,
        ease: "power3.inOut",
        delay: 0.125,
      });
  }, [windowWidth]);

  // Play/reverse animations based on menu state
  useEffect(() => {
    if (isMenuOpen) {
      menuAnimation.current.play();
      menuBarAnimation.current.play();
      menuLinksAnimation.current.play();
    } else {
      menuAnimation.current.reverse();
      menuBarAnimation.current.reverse();
      menuLinksAnimation.current.reverse();
    }
  }, [isMenuOpen]);

  // Auto-hide menu bar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        gsap.to(".menu-bar", {
          y: -200,
          duration: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(".menu-bar", {
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Cleanup: ensure body scroll is restored on unmount
  useEffect(() => {
    return () => {
      // Reset navigation flag
      isNavigatingRef.current = false;

      // Ensure body scroll is restored
      if (document.body.style.position === "fixed") {
        const scrollY = scrollPositionRef.current;
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        window.scrollTo(0, scrollY);
      }
    };
  }, []);

  return (
    <div className="menu-container">
      <div className="menu-bar" ref={menuBarRef}>
        <div className="menu-bar-container">
          <div className="menu-logo">
            <a href="#hero" onClick={handleLogoClick}>
              <h4>Miro</h4>
            </a>
          </div>
          <div className="menu-actions">
            <div className="desktop-nav-items">
              {menuLinks.map((link, index) => (
                <div key={index} className="desktop-nav-item">
                  <a
                    className="desktop-nav-link"
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
            {windowWidth < 1000 && (
              <div className="menu-nav-item">
                <a
                  className="menu-nav-link"
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, "#contact")}
                >
                  Let's connect
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="menu">
        <div className="menu-col">
          <div className="menu-sub-col">
            <div className="menu-links">
              {mobileMenuLinks.map((link, index) => (
                <div key={index} className="menu-link-item">
                  <div className="menu-link-item-holder">
                    <a
                      className="menu-link"
                      href={link.path}
                      onClick={(e) => handleLinkClick(e, link.path)}
                    >
                      {link.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
