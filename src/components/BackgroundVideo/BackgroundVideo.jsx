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
          videoRef.current.play();
        }
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, []);

  return <div className="bg-video">
    <video
      muted
      ref={videoRef}
      src="/home/hero.mp4"
      type="video/mp4"
      autoplay
      loop
      playsinline
      onCanPlay={handleCanPlay}
    />
  </div>;
};