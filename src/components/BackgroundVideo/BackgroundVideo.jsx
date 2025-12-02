import { forwardRef, useImperativeHandle, useRef } from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = forwardRef(({ onVideoLoaded, onVideoError }, ref) => {
  const videoRef = useRef(null);

  // Expose simple play method to parent
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (!videoRef.current) return;

      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        console.log("✅ Video playing");
      } catch (error) {
        console.error("❌ Video play failed:", error);
        throw error;
      }
    }
  }));

  const handleCanPlay = () => {
    console.log("Video ready");
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  };

  const handleError = (e) => {
    console.error("Video load error:", e);
    if (onVideoError) {
      onVideoError(e);
    }
  };

  return (
    <div className="bg-video">
      <video
        ref={videoRef}
        src="/home/hero.mp4"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;
