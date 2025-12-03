import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with controlled playback
 * Exposes play/pause methods via ref for parent control
 * 
 * IMPORTANT: Video will NOT autoplay - it waits for explicit play() call from parent
 * This ensures proper coordination with preloader animations
 */
const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError, shouldAutoplay = false }, ref) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Try to play video on first user interaction (mobile autoplay workaround)
  // Only if shouldAutoplay is true (for cases where preloader is skipped)
  useEffect(() => {
    if (!shouldAutoplay) return; // Don't try to autoplay if waiting for preloader

    const tryPlayOnInteraction = () => {
      if (!hasInteracted && videoRef.current) {
        setHasInteracted(true);
        // Try to play on user interaction - don't require isReady on mobile
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsReady(true);
            })
            .catch((error) => {
              console.warn("Video play failed on interaction:", error);
            });
        }
      }
    };

    // Try to play on various user interactions
    const events = ['touchstart', 'scroll', 'click', 'touchend'];
    events.forEach(event => {
      window.addEventListener(event, tryPlayOnInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, tryPlayOnInteraction);
      });
    };
  }, [hasInteracted, shouldAutoplay]);

  // Expose video control methods to parent component
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          // CRITICAL: Reset video to beginning before playing
          // This ensures video always starts from 0:00
          videoRef.current.currentTime = 0;
          
          // Try to play even if not marked as ready
          // This is important for mobile where ready state might be delayed
          await videoRef.current.play();
          setIsReady(true);
          return true;
        } catch (error) {
          console.warn("Failed to play video:", error);
          // Don't call onVideoError for play failures - they're expected on mobile
          return false;
        }
      }
      return false;
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    isReady: () => isReady,
    // Expose method to reset video to beginning
    reset: () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    },
  }));

  const handleCanPlay = () => {
    setIsReady(true);
    
    // Only attempt autoplay if explicitly allowed
    // Otherwise, wait for parent component to call play() via ref
    if (shouldAutoplay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay may fail on mobile - that's okay, will try again on user interaction
          console.warn("Autoplay prevented:", error);
        });
      }
    }
    
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  };

  const handleLoadedData = () => {
    // Additional handler for when video data is loaded
    // This can fire earlier than onCanPlay on some mobile devices
    if (videoRef.current && !isReady) {
      setIsReady(true);
      
      // Ensure video is paused initially (unless shouldAutoplay is true)
      if (!shouldAutoplay && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      
      // Only attempt autoplay if explicitly allowed
      if (shouldAutoplay) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Autoplay may fail - that's expected on some mobile browsers
            console.warn("Autoplay prevented on data load:", error);
          });
        }
      }
    }
  };

  // Ensure video stays paused on mount and when shouldAutoplay changes
  useEffect(() => {
    if (videoRef.current && !shouldAutoplay) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [shouldAutoplay]);

  const handleError = (e) => {
    console.error("Video failed to load:", e);
    if (onVideoError) {
      onVideoError(e);
    }
  };

  return (
    <div className="bg-video">
      <video
        ref={videoRef}
        src="/home/hero.mp4"
        type="video/mp4"
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
        // REMOVED: autoPlay attribute - video will be controlled via ref
        // This prevents video from starting before preloader completes
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;