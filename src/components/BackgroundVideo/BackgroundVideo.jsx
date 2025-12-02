import { forwardRef } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with simple ref forwarding
 * Parent controls playback directly via ref
 */
const BackgroundVideo = forwardRef((props, ref) => {

  const handleCanPlay = () => {
   
    // Attempt to play immediately when ready (important for mobile)
    if (ref.current) {
      const playPromise = ref.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay may fail on mobile - that's okay, will try again on user interaction
          console.warn("Autoplay prevented:", error);
        });
      }
    }
  };

  return (
    <div className="bg-video">
      <video
        ref={ref}
        src="/home/hero.mp4"
        muted
        loop
        playsInline
        preload="auto"
        autoPlay
        onCanPlay={handleCanPlay}
        webkit-playsinline="true"
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;