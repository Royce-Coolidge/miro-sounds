import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError }, ref) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current && isReady) {
        try {
          await videoRef.current.play();
          return true;
        } catch (error) {
          console.error("Failed to play video:", error);
          if (onVideoError) {
            onVideoError(error);
          }
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
    if (onVideoLoaded) {
      onVideoLoaded();
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
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;