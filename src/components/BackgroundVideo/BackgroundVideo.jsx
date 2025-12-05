import "./BackgroundVideo.css";


export default function BackgroundVideo ({ onVideoLoaded }) {
  const handleCanPlay = () => {
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  };

  return <div className="bg-video">
    <video
      src="/home/hero.mp4"
      type="video/mp4"
      autoPlay
      muted
      loop
      playsInline
      onCanPlay={handleCanPlay}
    />
  </div>;
};