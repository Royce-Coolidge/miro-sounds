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

  // Handle mobile interaction requirement for video playback
  // Mobile browsers require user interaction before video.play() works
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        console.log("📱 User interaction detected - video playback unlocked");
      }
    };

    // Listen for any user interaction to unlock video on mobile
    const events = ['touchstart', 'click', 'pointerdown'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted]);

  // Expose video control methods to parent component
  useImperativeHandle(ref, () => ({
    play: async () => {
      console.log("▶️ Play called via ref");
      if (videoRef.current) {
        try {
          // Always reset to beginning before playing
          videoRef.current.currentTime = 0;
          console.log("▶️ Reset to 00:00, attempting play...");
          await videoRef.current.play();
          console.log("▶️ ✅ Video playing successfully!");
          setIsReady(true);
          return true;
        } catch (error) {
          console.error("▶️ ❌ Failed to play video:", error);
          // Don't call onVideoError for play failures - they're expected on mobile
          return false;
        }
      }
      console.error("▶️ ❌ videoRef.current is null");
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
    console.log("🎬 Video canPlay - ready but staying paused");
    if (!isReady) {
      setIsReady(true);
      // Keep video paused until parent explicitly calls play()
      // This ensures video doesn't start before preloader completes
      if (videoRef.current) {
        videoRef.current.pause();
        console.log("🎬 Video paused, waiting for preloader");
      }
      if (onVideoLoaded) {
        onVideoLoaded();
      }
    }
  };

  const handleLoadedData = () => {
    // Additional handler for when video data is loaded
    // Keep video paused and ready - don't auto-play
    if (videoRef.current && !isReady) {
      setIsReady(true);
      videoRef.current.pause();
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