import './App.css';
import React, { useRef, useState } from 'react';
import VideoClip from './VideoClip';
import VideoContainer from './VideoContainer';

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
    <div>
      <VideoContainer
        videoURL={videoURL}
        videoID={videoID}
        dataObj={dataObjRef.current}
      />
          <button className="btn" type="button" onClick={handleSubmit}>
            Submit
          </button>
    </div>
  );

  /*
  return (
    <VideoClip
      videoURL="something_something/1.webm"
      startSecs={1.0}
      endSecs={1.5}
      dataObj={globalDataObj}
    />
  );
*/
}

export default App;
