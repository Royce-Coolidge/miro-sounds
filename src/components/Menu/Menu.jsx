import React, { useEffect, useRef, useState } from "react";
import "./Menu.css";

import { gsap } from "gsap";
import { useLenis } from "lenis/react";

const Menu = () => {
  const menuLinks = [
   
    { path: "#about", label: "About Us" },
    { path:"#how-we-work", label: "How We Work" },
    { path: "#contact", label: "Let's connect"}
  ];

  const mobileMenuLinks = [
    { path: "/", label: "Back to Top" },
    { path: "/contact", label: "Let's connect"}
  ];

  const lenis = useLenis();
  const menuContainer = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useRef();
  const menuLinksAnimation = useRef();
  const menuBarAnimation = useRef();

  const lastScrollY = useRef(0);
  const menuBarRef = useRef();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const scrollPositionRef = useRef(0);

  const toggleBodyScroll = (disableScroll) => {
    if (disableScroll) {
      scrollPositionRef.current = window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      window.scrollTo(0, scrollPositionRef.current);
    }
  };

  const toggleMenu = () => {
    document.querySelector(".hamburger-icon").classList.toggle("active");
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    toggleBodyScroll(newMenuState);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      document.querySelector(".hamburger-icon").classList.toggle("active");
      setIsMenuOpen(false);
      toggleBodyScroll(false);
    } else return;
  };

  const handleLinkClick = (e, path) => {
    // All links are now anchor links for single-page site
    if (path.startsWith('#')) {
      e.preventDefault();

      const hash = path.substring(1);
      const targetElement = document.getElementById(hash);

      if (targetElement && lenis) {
        // Close the menu first
        closeMenu();

        // Use Lenis for smooth scrolling
        lenis.scrollTo(targetElement, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (lenis) {
      closeMenu();
      // Scroll to top
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    return () => {
      if (document.body.style.position === "fixed") {
        toggleBodyScroll(false);
      }
    };
  }, []);

  return (
    <div className="menu-container" ref={menuContainer}>
      <div className="menu-bar" ref={menuBarRef}>
        <div className="menu-bar-container">
          <div className="menu-logo">
            <a href="#hero" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <h4>Miro</h4>
            </a>
          </div>
          <div className="menu-actions">
            <div className="desktop-nav-items">
            {menuLinks.map((link, index) => (
              <div key={index} className="">
                <div className="desktop-nav-item">
                  <a
                    className="desktop-nav-link"
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                  >
                    {link.label}
                  </a>
                </div>
              </div>
            ))}
              </div>
          {windowWidth < 1000 && (
              <div className="menu-toggle">
                <button className="hamburger-icon" onClick={toggleMenu}></button>
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
