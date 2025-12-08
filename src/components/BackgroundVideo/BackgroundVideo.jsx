import { useRef, useEffect } from "react";
import "./BackgroundVideo.css";


export default function BackgroundVideo ({ onVideoLoaded }) {
  const videoRef = useRef(null);

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
};