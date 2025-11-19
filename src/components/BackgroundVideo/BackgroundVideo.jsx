import "./BackgroundVideo.css";


export default function BackgroundVideo () {
  return <div className="bg-video">
    <video src="/home/hero.mp4" type="video/mp4" autoPlay muted loop playsInline />
  </div>;
};