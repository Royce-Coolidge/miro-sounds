import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with controlled playback
 * Exposes play/pause methods via ref for parent control
 */
const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError }, ref) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Expose video control methods to parent component
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
          setIsReady(true);
          return true;
        } catch (error) {
          console.error("Video play failed:", error);
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
    if (!isReady) {
      setIsReady(true);
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
        autoPlay
        muted
        loop
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