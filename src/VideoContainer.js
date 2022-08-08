/* eslint-disable max-len */
import './VideoContainer.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const colors = [
  [255, 0, 0], // Red
  [0, 0, 255], // Blue
  [0, 255, 0], // Green
  [255, 170, 0], // Orange
  [255, 0, 255], // Purple
  [255, 255, 0], // Yellow
];

const options = ['touch', 'release', 'slide', 'roll'];

function VideoContainer({ videoID, videoURL, videoFPS, dataObj }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(NaN);
  const [currFrameReduced, setCurrFrameReduced] = useState(0);
  const currFrameFullRef = useRef(0);
  const [_forceUpdate, setForceUpdate] = useState(false);
  const keydownHandlerRef = useRef(null);

  const [pointTimeOne, setPointTimeOne] = useState(false);
  const [pointTimeTwo, setPointTimeTwo] = useState(false);

  const reducedFPS = 4; // Math.max(4, Math.floor(videoFPS / 3));
  const lastFrameReduced = Math.floor(duration * reducedFPS);
  // const lastFrameFull = Math.floor(duration * videoFPS);

  function centerOfFrameReduced(n) {
    return (n + 0.5) / reducedFPS;
  }

  function setTime(secs) {
    videoRef.current.currentTime = Math.max(Math.min(secs, duration || Infinity), 0);
  }

  function setFrameReduced(n) {
    setTime(centerOfFrameReduced(n));
  }

  function incrFrameReduced(n) {
    setFrameReduced(currFrameReduced + n);
    videoRef.current.pause();
  }

  function centerOfFrameFull(n) {
    return (n + 0.5) / videoFPS;
  }

  function setFrameFull(n) {
    setTime(centerOfFrameFull(n));
  }

  function incrFrameFull(n) {
    setFrameFull(currFrameFullRef.current + n);
    videoRef.current.pause();
  }

  function timeUpdate() {
    currFrameFullRef.current = Math.floor(videoRef.current.currentTime * videoFPS);
    setCurrFrameReduced(Math.floor(videoRef.current.currentTime * reducedFPS));
    setForceUpdate((val) => !val);
  }

  if (typeof dataObj[videoID] === 'undefined') {
    dataObj[videoID] = [];
  }

  function handleReady(e) {
    setDuration(e.target.duration);
  }

  function keydownHandler(e) {
    switch (e.key) {
      case ',':
        incrFrameFull(-1);
        break;
      case '.':
        incrFrameFull(1);
        break;
      case 'ArrowLeft':
        setTime(videoRef.current.currentTime - 0.5);
        break;
      case 'ArrowRight':
        setTime(videoRef.current.currentTime + 0.5);
        break;
      case ' ':
      case 'Spacebar':
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
        break;
      case 'Escape':
        setPointTimeOne(false);
        setPointTimeTwo(false);
        break;
      default:
    }
  }
  keydownHandlerRef.current = keydownHandler;

  document.addEventListener('keydown', (e) => (keydownHandlerRef.current(e)));

  function onClickVideo(e) {
    e.preventDefault();
    const { left, right, top, bottom } = e.target.getBoundingClientRect();
    const clientX = e.clientX - left;
    const clientY = e.clientY - top;
    const clientW = right - left;
    const clientH = bottom - top;

    const x = clientX / clientW;
    const y = clientY / clientH;
    const time = e.target.currentTime;
    const pointTime = { time, x, y };

    if (!pointTimeOne) {
      setPointTimeOne(pointTime);
    } else if (!pointTimeTwo) {
      e.target.pause();
      let newPointTimeOne = pointTimeOne;
      let newPointTimeTwo = pointTime;
      let diff = newPointTimeTwo.time - newPointTimeOne.time;
      if (diff < 0) {
        const temp = newPointTimeOne;
        newPointTimeOne = newPointTimeTwo;
        newPointTimeTwo = temp;
        diff = -diff;
      }
      if (diff < 0.25) {
        newPointTimeOne.time -= (0.25 - diff) / 2;
        newPointTimeTwo.time += (0.25 - diff) / 2;
      }
      setPointTimeOne(newPointTimeOne);
      setPointTimeTwo(newPointTimeTwo);
    }
  }

  function getRelativePositionOfPoint(px, py) {
    const videoRect = videoRef.current.getBoundingClientRect();
    const videoW = videoRect.right - videoRect.left;
    const videoH = videoRect.bottom - videoRect.top;
    const videoX = videoRef.current.offsetLeft;
    const videoY = videoRef.current.offsetTop;

    const pxAdjusted = (px * videoW) + videoX;
    const pyAdjusted = (py * videoH) + videoY;

    return [pxAdjusted, pyAdjusted];
  }

  function getPointStyle(px, py, i) {
    const color = colors[i % colors.length];
    const [pxAdjusted, pyAdjusted] = getRelativePositionOfPoint(px, py);

    return ({
      outlineColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      left: pxAdjusted,
      top: pyAdjusted,
    });
  }

  function getRectangleStyle(p1x, p1y, p2x, p2y, i) {
    const color = colors[i % colors.length];

    const [p1xAdjusted, p1yAdjusted] = getRelativePositionOfPoint(p1x, p1y);
    const [p2xAdjusted, p2yAdjusted] = getRelativePositionOfPoint(p2x, p2y);
    const x = Math.min(p1xAdjusted, p2xAdjusted);
    const y = Math.min(p1yAdjusted, p2yAdjusted);
    const w = Math.abs(p1xAdjusted - p2xAdjusted);
    const h = Math.abs(p1yAdjusted - p2yAdjusted);

    return ({
      outlineColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
      left: x,
      top: y,
      width: w,
      height: h,
    });
  }

  function handleCancel() {
    setPointTimeOne(false);
    setPointTimeTwo(false);
  }

  function handleSubmit(e) {
    const option = e.target.value;

    dataObj[videoID].push({
      type: option,
      points: [pointTimeOne, pointTimeTwo],
    });

    setPointTimeOne(false);
    setPointTimeTwo(false);
    videoRef.current.play();
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div id="video-container">
      <video
        id="main-video"
        src={videoURL}
        autoPlay
        ref={videoRef}
        onLoadedMetadata={handleReady}
        onTimeUpdate={timeUpdate}
        onClick={onClickVideo}
      />
      {dataObj[videoID].map(({ type, points: [p1, p2] }, i) => (
        ((p1.time <= videoRef.current.currentTime) && (p2.time >= videoRef.current.currentTime))
        && (
          <div
            key={i}
            className="rectangle"
            style={getRectangleStyle(p1.x, p1.y, p2.x, p2.y, i)}
          >
            <span className="rectText">{type}</span>
          </div>
        )
      ))}
      {pointTimeOne && pointTimeTwo && (
          <div
            key={dataObj[videoID].length}
            className="rectangle"
            style={getRectangleStyle(pointTimeOne.x, pointTimeOne.y, pointTimeTwo.x, pointTimeTwo.y, dataObj[videoID].length)}
          />
      )}
      {pointTimeOne && (
        <span
          className="dot"
          style={getPointStyle(pointTimeOne.x, pointTimeOne.y, dataObj[videoID].length)}
        />
      )}
      {pointTimeTwo && (
        <span
          className="dot"
          style={getPointStyle(pointTimeTwo.x, pointTimeTwo.y, dataObj[videoID].length)}
        />
      )}
      {pointTimeOne && pointTimeTwo && (
        <div className="popup">
          <div>What type of contact is this?</div>
          {
            options.map((opt) => (
              <button className="btn" type="button" key={opt} value={opt} onClick={handleSubmit}>
                {opt}
              </button>
            ))
          }
          <br />
          <button className="btn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      <div id="frames-container-container">
        <div className="frames-container">
          {[-2, -1, 0, 1, 2].map((i) => (
            <div className="frame-container" key={currFrameReduced + i}>
              <video
                className="frame"
                src={`${videoURL}#t=${centerOfFrameReduced(currFrameReduced + i)}`}
                preload={
                  ((currFrameReduced + i) > lastFrameReduced) || ((currFrameReduced + i) < 0)
                    ? 'none'
                    : 'metadata'
                }
                poster={
                  ((currFrameReduced + i) > lastFrameReduced) || ((currFrameReduced + i) < 0)
                    ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=' // Pure black image
                    : null
                }
                onClick={() => (incrFrameReduced(i))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoContainer;
