import './VideoContainer.css';
import React, { useRef, useState } from 'react';
import VideoClip from './VideoClip';

function VideoContainer({ videoURL, videoID, dataObj }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(NaN);

  if (typeof dataObj[videoID] === 'undefined') {
    dataObj[videoID] = {};
  }

  const segments = !Number.isNaN(duration)
    ? Array.from({ length: Math.ceil(duration * 1.0) }, (_, i) => (i / 1.0))
    : false;

  function handleReady(e) {
    setDuration(e.target.duration);
  }

  return (
    <div className="videoContainer">
      <video
        src={videoURL}
        width="65%"
        autoPlay
        controls
        ref={videoRef}
        onLoadedMetadata={handleReady}
      />
      {segments && segments.map((_, i) => (
          <VideoClip
            key={`${videoID}:${i}`}
            videoURL={videoURL}
            startSecs={segments[i]}
            endSecs={i + 1 < segments.length ? segments[i + 1] : duration}
            dataObj={dataObj[videoID]}
          />
      ))}
    </div>
  );
}

export default VideoContainer;
