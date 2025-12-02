import { forwardRef } from "react";
import "./BackgroundVideo.css";

/**
 * Background video component with simple ref forwarding
 * Parent controls playback directly via ref
 */
const BackgroundVideo = forwardRef((props, ref) => {

  
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
     
        webkit-playsinline="true"
      />
    </div>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default BackgroundVideo;