import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with controlled playback
 * Exposes play/pause methods via ref for parent control
 */
const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError }, ref) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Try to play video on first user interaction (mobile autoplay workaround)
  useEffect(() => {
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
  }, [hasInteracted]);

  // Expose video control methods to parent component
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
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
  }));

  const handleCanPlay = () => {
    setIsReady(true);
    // Attempt to play immediately when ready (important for mobile)
    if (videoRef.current) {
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
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay may fail - that's expected on some mobile browsers
          console.warn("Autoplay prevented on data load:", error);
        });
      }
    }
  };

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
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;