import { useRef, useEffect } from "react";
import "./BackgroundVideo.css";


export default function BackgroundVideo ({ onVideoLoaded }) {
  const videoRef = useRef(null);

  const handleCanPlay = () => {
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  };

  return <div className="bg-video" dangerouslySetInnerHTML={{ __html: `
    <video
      ref={videoRef}
      src="/home/hero.mp4"
      type="video/mp4"
      muted
      autoplay
      loop
      playsinline
      
    />,
      ` }}></div>
};