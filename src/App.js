import './App.css';
import React, { useRef, useState } from 'react';
import VideoContainer from './VideoContainer';
import mediaInfo from './data/media_info.json';

function App() {
  const dataObjRef = useRef({});
  let firstID = 1;
  while (localStorage.getItem(`${firstID}.webm`) !== null) {
    firstID += 1;
  }
  const [videoID, setVideoID] = useState(firstID);
  if (localStorage.getItem(`${videoID}.webm`) !== null) {
    setVideoID((value) => value + 1);
  }

  const videoURL = `${process.env.PUBLIC_URL}/something_something/${videoID}.webm`;

  function handleSubmit() {
    localStorage.setItem(`${videoID}.webm`, JSON.stringify(dataObjRef.current[videoID]));
    dataObjRef.current = {};
    window.scrollTo(0, 0);
    setVideoID((value) => value + 1);
  }

  return (
    <div id="app">
      <VideoContainer
        videoID={videoID}
        videoURL={videoURL}
        videoFPS={mediaInfo[String(videoID)].frame_rate}
        aspectRatio={mediaInfo[String(videoID)].width / mediaInfo[String(videoID)].height}
        dataObj={dataObjRef.current}
      />
      <button
        className="btn"
        type="button"
        onClick={handleSubmit}
        id={`button${videoID}`}
        key={`button${videoID}`}
      >
        Submit
      </button>
    </div>
  );
}

export default App;
