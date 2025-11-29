import React from "react";
import "./TutorialVideos.css";

const videoData = [
  {
    title: "Full Body HIIT + Cardio",
    videos: [
      "https://www.youtube.com/embed/Ij2NtOL66rU",
      "https://www.youtube.com/embed/cbKkB3POqaY",
      "https://www.youtube.com/embed/M0uO8X3_tEA"
    ]
  },
  {
    title: "Lower Body Fat Burn",
    videos: [
      "https://www.youtube.com/embed/McqewRhjI7o",
      "https://www.youtube.com/embed/I9nG-G4B5Bs",
      "https://www.youtube.com/embed/nSECUu4VFOc"
    ]
  },
  {
    title: "Cardio + Core Shred",
    videos: [
      "https://www.youtube.com/embed/ZiHVcBKiUlo",
      "https://www.youtube.com/embed/_ZHMtl8MxA0"
    ]
  },
  {
    title: "Active Recovery",
    videos: [
      "https://www.youtube.com/embed/Agu4EnLxAGM",
      "https://www.youtube.com/embed/R0eqxnSyRkM",
      "https://www.youtube.com/embed/qti526J8YXY"
    ]
  },
  {
    title: "Upper Body & Arms",
    videos: [
      "https://www.youtube.com/embed/2PdsSfxD_1A",
      "https://www.youtube.com/embed/N_gu3D0GoFo",
      "https://www.youtube.com/embed/rSohL4gWm9A"
    ]
  },
  {
    title: "Chest + Triceps",
    videos: [
      "https://www.youtube.com/embed/ExfFozZMheI",
      "https://www.youtube.com/embed/gXYDOcuC_cQ",
      "https://www.youtube.com/embed/I6zjFZ1DbBk"
    ]
  },
  {
    title: "Back + Biceps",
    videos: [
      "https://www.youtube.com/embed/I6zjFZ1DbBk",
      "https://www.youtube.com/embed/oC6sKQHMSyA",
      "https://www.youtube.com/embed/Frp4P3Xlzd0"
    ]
  },
  {
    title: "Leg Day",
    videos: [
      "https://www.youtube.com/embed/q7rCeOa_m58",
      "https://www.youtube.com/embed/nJvaflbAhHk",
      "https://www.youtube.com/embed/ueNGcoH3o7M"
    ]
  },
  {
    title: "Shoulders + Abs",
    videos: [
      "https://www.youtube.com/embed/ToixVkdbg0I",
      "https://www.youtube.com/embed/WicMjxpuoOo",
      "https://www.youtube.com/embed/zC9Ru4UycRs"
    ]
  },
  {
    title: "Arms Day",
    videos: [
      "https://www.youtube.com/embed/eDv9bnz3GT8",
      "https://www.youtube.com/embed/Bl28i6fWljU",
      "https://www.youtube.com/embed/nzwU9RR6l2w"
    ]
  }
];

function TutorialVideos() {
  return (
    <div className="video-section-container">
      <h2 className="section-title">Workout Tutorial Videos</h2>

      {videoData.map((category, index) => (
        <div key={index} className="video-category">
          <h3 className="category-title">{category.title}</h3>

          <div className="video-grid">
            {category.videos.map((url, i) => (
              <iframe
                key={i}
                src={url}
                allowFullScreen
                className="video-frame"
              ></iframe>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TutorialVideos;
