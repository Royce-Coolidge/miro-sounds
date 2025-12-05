import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with parent-controlled playback
 *
 * PLAYBACK CONTROL:
 * - Video never autoplays - parent must call play() via ref
 * - Ensures proper coordination with preloader and animations
 *
 * MOBILE HANDLING:
 * - Call unlock() during user interaction to enable later playback
 * - Then call play() when ready (e.g., after preloader completes)
 */
const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError }, ref) => {
  const videoRef = useRef(null);
  const [isDataReady, setIsDataReady] = useState(false);

  // Expose video control methods to parent component
  useImperativeHandle(ref, () => ({
    /**
     * Play the video from the beginning
     * @returns {Promise<boolean>} True if play succeeded, false otherwise
     */
    play: async () => {
      if (!videoRef.current) return false;

      try {
        // Always reset to beginning before playing
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        return true;
      } catch (error) {
        console.warn("Failed to play video:", error);
        return false;
      }
    },

    /**
     * Pause the video
     */
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },

    /**
     * Check if video data is loaded and ready
     * @returns {boolean} True if video can be played
     */
    isReady: () => isDataReady,

    /**
     * Reset video to beginning without playing
     */
    reset: () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    },

    /**
     * Unlock video playback on mobile devices
     * Must be called during a user interaction event (click, touch, etc.)
     * After unlocking, play() can be called later without user interaction
     * @returns {Promise<boolean>} True if unlock succeeded, false otherwise
     */
    unlock: async () => {
      if (!videoRef.current) return false;

      try {
        // Play then immediately pause to unlock - the unlock persists
        await videoRef.current.play();
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        return true;
      } catch (error) {
        console.warn("Video unlock failed:", error);
        return false;
      }
    },
  }), [isDataReady]);

  const handleCanPlay = () => {
    // Video data is loaded and ready to play
    // Don't change this to also trigger playback - that would break parent control
    if (!isDataReady) {
      setIsDataReady(true);
      if (onVideoLoaded) {
        onVideoLoaded();
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
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;