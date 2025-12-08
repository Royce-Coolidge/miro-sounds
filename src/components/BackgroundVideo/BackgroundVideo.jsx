import { useRef, useEffect, forwardRef } from "react";
import "./BackgroundVideo.css";


const BackgroundVideo = forwardRef(({ onVideoLoaded }, ref) => {
  const videoRef = ref || useRef(null);

  const handleCanPlay = () => {
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video is ready
      video.load();
      video.pause();

      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log("Autoplay failed:", error);
          });
        }
      }, 7000);

      // Fallback: play on first user interaction
      const handleUserInteraction = () => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(error => {
            console.log("Play on interaction failed:", error);
          });
        }
      };

      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      document.addEventListener('click', handleUserInteraction, { once: true });

      return () => {
        clearTimeout(timer);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      };
    }
  }, []);

  return <div className="bg-video">
    <video
      ref={videoRef}
      src="/home/hero.mp4"
      autoPlay={true}
      muted={true}
      loop={true}
      playsInline={true}
      webkit-playsinline="true"
      preload="none"
      onCanPlay={handleCanPlay}
    />
  </div>;
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;