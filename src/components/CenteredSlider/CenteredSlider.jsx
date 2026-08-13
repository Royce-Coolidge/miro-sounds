import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { horizontalLoop } from "./horizontalLoop";
import defaultReviews from "../../data/reviews";
import "./CenteredSlider.css";

gsap.registerPlugin(CustomEase, ScrollTrigger);

// Registering the same ease id more than once is a no-op, so this is safe.
if (!CustomEase.get("centered-slider-ease")) {
  CustomEase.create("centered-slider-ease", "0.625, 0.05, 0, 1");
}

const EASE = "centered-slider-ease";
const NAV_DURATION = 0.725;

// Map the project's `reviews` shape ({ copy }) onto the generic slide shape ({ quote }).
const normaliseSlides = (slides) =>
  slides.map((s, i) => ({
    id: s.id ?? i,
    quote: s.quote ?? s.copy ?? "",
    author: s.author ?? "",
    image: s.image ?? "",
  }));

/**
 * CenteredSlider — a reusable, centered, looping, draggable slider.
 *
 * Uses the global typography (Rader / Messina Sans / Messina Sans Mono) and colour
 * tokens (--fgrory, --fg, --bg200). Colours can be re-themed per instance by
 * overriding the local --cs-* custom properties in a wrapping selector.
 *
 * @param {Array}   slides            [{ id, quote|copy, author, image }] (defaults to reviews data)
 * @param {boolean} autoplay          auto-advance while in view (default true)
 * @param {number}  autoplayDuration  seconds between auto-advances (default 4)
 * @param {boolean} showBullets       show avatar bullet navigation (default true)
 * @param {boolean} showArrows        show prev/next arrow buttons (default true)
 * @param {number}  initialIndex      slide centered on mount (default 0)
 * @param {string}  heading           optional heading rendered above the slider
 * @param {string}  ariaLabel         accessible label for the slider region
 * @param {string}  className         extra class names on the wrapper
 */
const CenteredSlider = ({
  slides = defaultReviews,
  autoplay = true,
  autoplayDuration = 4,
  showBullets = true,
  showArrows = true,
  initialIndex = 0,
  heading,
  ariaLabel = "Testimonial slider",
  className = "",
}) => {
  const wrapperRef = useRef(null);
  const items = normaliseSlides(slides);

  // A seamless centered loop needs more slides than are visible at once — with too
  // few, the neighbours can't fill both sides of the active card and one side is
  // left empty. When the unique set is small, repeat it so the track always fills.
  // Bullets stay mapped to the unique reviews via `index % items.length`.
  const MIN_LOOP_SLIDES = 9;
  const repeats =
    items.length > 0 ? Math.max(1, Math.ceil(MIN_LOOP_SLIDES / items.length)) : 1;
  const loopItems =
    repeats > 1 ? Array.from({ length: repeats }, () => items).flat() : items;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const slideEls = gsap.utils.toArray(
      wrapper.querySelectorAll('[data-centered-slider="slide"]')
    );
    if (slideEls.length === 0) return;

    const bulletEls = gsap.utils.toArray(
      wrapper.querySelectorAll('[data-centered-slider="bullet"]')
    );
    const prevButton = wrapper.querySelector('[data-centered-slider="prev-button"]');
    const nextButton = wrapper.querySelector('[data-centered-slider="next-button"]');

    let activeElement;
    let activeBullet;
    let currentIndex = 0;
    let autoplayCall;

    const duration = autoplay ? autoplayDuration : 0;

    slideEls.forEach((slide, i) => slide.setAttribute("id", `slide-${i}`));
    bulletEls.forEach((bullet, i) => {
      bullet.setAttribute("aria-controls", `slide-${i}`);
      bullet.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
    });

    const loop = horizontalLoop(slideEls, {
      paused: true,
      draggable: true,
      center: true,
      onChange: (element, index) => {
        currentIndex = index;

        if (activeElement) activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;

        if (bulletEls.length > 0) {
          // Map the loop index (which spans clones) back to the unique bullet set.
          const bulletIndex = index % bulletEls.length;
          if (activeBullet) activeBullet.classList.remove("active");
          if (bulletEls[bulletIndex]) {
            bulletEls[bulletIndex].classList.add("active");
            activeBullet = bulletEls[bulletIndex];
          }
          bulletEls.forEach((bullet, i) =>
            bullet.setAttribute("aria-selected", i === bulletIndex ? "true" : "false")
          );
        }
      },
    });

    // Center the requested slide on init.
    loop.toIndex(Math.min(Math.max(initialIndex, 0), slideEls.length - 1), {
      duration: 0.01,
    });

    const startAutoplay = () => {
      if (duration > 0 && !autoplayCall) {
        const repeat = () => {
          loop.next({ ease: EASE, duration: NAV_DURATION });
          autoplayCall = gsap.delayedCall(duration, repeat);
        };
        autoplayCall = gsap.delayedCall(duration, repeat);
      }
    };

    const stopAutoplay = () => {
      if (autoplayCall) {
        autoplayCall.kill();
        autoplayCall = null;
      }
    };

    // Autoplay only while the slider is on screen.
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: startAutoplay,
      onLeave: stopAutoplay,
      onEnterBack: startAutoplay,
      onLeaveBack: stopAutoplay,
    });

    const handleMouseEnter = () => stopAutoplay();
    const handleMouseLeave = () => {
      if (ScrollTrigger.isInViewport(wrapper)) startAutoplay();
    };
    wrapper.addEventListener("mouseenter", handleMouseEnter);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    // Direct navigation: click a slide.
    const slideClickHandlers = slideEls.map((slide, i) => {
      const handler = () => loop.toIndex(i, { ease: EASE, duration: NAV_DURATION });
      slide.addEventListener("click", handler);
      return handler;
    });

    // Direct navigation: click a bullet.
    const bulletClickHandlers = bulletEls.map((bullet, i) => {
      const handler = () => {
        loop.toIndex(i, { ease: EASE, duration: NAV_DURATION });
        if (activeBullet) activeBullet.classList.remove("active");
        bullet.classList.add("active");
        activeBullet = bullet;
        bulletEls.forEach((b, j) =>
          b.setAttribute("aria-selected", j === i ? "true" : "false")
        );
      };
      bullet.addEventListener("click", handler);
      return handler;
    });

    const handlePrev = () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = slideEls.length - 1;
      loop.toIndex(newIndex, { ease: EASE, duration: NAV_DURATION });
    };
    const handleNext = () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= slideEls.length) newIndex = 0;
      loop.toIndex(newIndex, { ease: EASE, duration: NAV_DURATION });
    };
    prevButton && prevButton.addEventListener("click", handlePrev);
    nextButton && nextButton.addEventListener("click", handleNext);

    // Teardown — StrictMode-safe: everything created above is undone here.
    return () => {
      stopAutoplay();
      st.kill();
      wrapper.removeEventListener("mouseenter", handleMouseEnter);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
      slideEls.forEach((slide, i) =>
        slide.removeEventListener("click", slideClickHandlers[i])
      );
      bulletEls.forEach((bullet, i) =>
        bullet.removeEventListener("click", bulletClickHandlers[i])
      );
      prevButton && prevButton.removeEventListener("click", handlePrev);
      nextButton && nextButton.removeEventListener("click", handleNext);
      // Reverts the loop timeline + Draggable and removes the internal resize listener.
      loop.gsapContext?.revert();
    };
  }, [slides, autoplay, autoplayDuration, initialIndex]);

  return (
    <div
      ref={wrapperRef}
      aria-label={ariaLabel}
      data-centered-slider="wrapper"
      className={`centered-slider-group ${className}`.trim()}
    >
      {heading && <h3 className="centered-slider-heading">{heading}</h3>}

      {showBullets && (
        <div className="centered-slider-content">
          <ul role="tablist" className="centered-slider-bullet__list">
            {items.map((slide, i) => (
              <li key={`bullet-${slide.id}`} className="centered-slider-bullet__item">
                <button
                  type="button"
                  data-centered-slider="bullet"
                  role="tab"
                  aria-selected="false"
                  aria-label={`Show testimonial ${i + 1}${
                    slide.author ? `: ${slide.author}` : ""
                  }`}
                  className="centered-slider-bullet"
                >
                  <span className="centered-slider-bullet__number">{i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="centered-slider-row">
        <div
          aria-label="slides"
          data-centered-slider="list"
          role="group"
          className="centered-slider-list"
        >
          {loopItems.map((slide, i) => (
            <div
              key={`slide-${i}`}
              data-centered-slider="slide"
              className="centered-slider-slide"
              aria-hidden={i >= items.length ? "true" : undefined}
            >
              <div className="centered-slider-slide__inner">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt=""
                    className="centered-slider-slide__thumbnail"
                  />
                )}
                <p className="secondary centered-slider-slide__quote">{slide.quote}</p>
                <div className="centered-slider-slide__details">
                  {slide.author && (
                    <span className="primary sm centered-slider-slide__author">
                      {slide.author}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <div className="centered-slider-content">
          <div className="centered-slider-buttons">
            <button
              type="button"
              aria-label="previous slide"
              data-centered-slider="prev-button"
              className="centered-slider-button is--prev"
            >
              <Arrow />
            </button>
            <button
              type="button"
              aria-label="next slide"
              data-centered-slider="next-button"
              className="centered-slider-button"
            >
              <Arrow />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 24 24"
    fill="none"
    className="slider-button-arrow"
  >
    <path d="M14 19L21 12L14 5" stroke="currentColor" strokeMiterlimit="10" />
    <path d="M21 12H2" stroke="currentColor" strokeMiterlimit="10" />
  </svg>
);

export default CenteredSlider;
