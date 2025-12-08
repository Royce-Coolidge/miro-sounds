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
    if (videoRef.current) {
      videoRef.current.pause();

      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log("Autoplay failed:", error);
          });
        }
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  return <div className="bg-video">
    <video
      ref={videoRef}
      src="/home/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      webkit-playsinline="true"
      onCanPlay={handleCanPlay}
    />
  </div>;
};