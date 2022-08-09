import './App.css';
import React, { useRef, useState } from 'react';
import VideoContainer from './VideoContainer';
import Rules from './Rules';
import mediaInfo from './data/media_info.json';

function App() {
  const overrideID = parseInt(localStorage.getItem('overrideID'), 10);
  let firstID = 1;
  if (!overrideID) {
    while (localStorage.getItem(`${firstID}.webm`) !== null) {
      firstID += 1;
    }
  }
  const [videoID, setVideoID] = useState(overrideID || firstID);
  if (!overrideID && (localStorage.getItem(`${videoID}.webm`) !== null)) {
    setVideoID((value) => value + 1);
  }

  function getDataObj(vid) {
    return { [vid]: JSON.parse(localStorage.getItem(`${vid}.webm`)) || [] };
    // const obj = localStorage.getItem(`${vid}.webm`);
    // if (obj) {
    //   return { [vid]: obj };
    // }
    // return {};
  }

  const dataObjRef = useRef(getDataObj(videoID));

  const videoURL = `${process.env.PUBLIC_URL}/something_something/${videoID}.webm`;

  function handleSubmit() {
    localStorage.setItem(`${videoID}.webm`, JSON.stringify(dataObjRef.current[videoID]));
    dataObjRef.current = getDataObj(videoID + 1);
    setVideoID((value) => value + 1);
  }

  const [showingRules, setShowingRules] = useState(false);

  return (
    <div id="app">
      {!showingRules && (
      <div id="picker-app">
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
      )}
      {showingRules && (<Rules />)}
      <div
        className="toggle"
        onClick={() => (setShowingRules((r) => !r))}
      >
        {showingRules ? 'Hide Instructions' : 'Show Instructions'}
      </div>
    </div>
  );
}

export default App;
