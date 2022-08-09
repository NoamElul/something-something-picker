/* eslint-disable max-len */
import './VideoContainer.css';
import React, { useEffect, useRef, useState } from 'react';

const colors = [
  [255, 0, 0], // Red
  [0, 0, 255], // Blue
  [0, 255, 0], // Green
  [255, 170, 0], // Orange
  [255, 0, 255], // Purple
  [255, 255, 0], // Yellow
];

const options = ['touch', 'stop touching', 'slide'];

function VideoContainer({ videoID, videoURL, videoFPS, dataObj }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(NaN);
  const [videoWidth, setVideoWidth] = useState(NaN);
  const [currFrame, setCurrFrame] = useState(0);
  const [currTime, setCurrTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [_forceUpdate, setForceUpdate] = useState(false);
  const keydownHandlerRef = useRef(null);

  const [pointTimeOne, setPointTimeOne] = useState(false);
  const [pointTimeTwo, setPointTimeTwo] = useState(false);

  if (videoRef?.current?.offsetWidth && (videoWidth !== videoRef.current.offsetWidth)) {
    setVideoWidth(videoRef.current.offsetWidth);
  }

  function setTime(secs) {
    videoRef.current.currentTime = Math.max(Math.min(secs, duration || Infinity), 0);
  }

  function centerOfFrame(n) {
    return (n + 0.5) / videoFPS;
  }

  function setFrame(n) {
    setTime(centerOfFrame(n));
  }

  function incrFrame(n) {
    setFrame(currFrame + n);
    videoRef.current.pause();
  }

  function timeUpdate() {
    setCurrFrame(Math.floor(videoRef.current.currentTime * videoFPS));
    setCurrTime(videoRef.current.currentTime);
  }

  function pauseHandler() {
    setIsPaused(true);
  }

  function playHandler() {
    setIsPaused(false);
  }

  if (typeof dataObj[videoID] === 'undefined') {
    dataObj[videoID] = [];
  }

  function handleReady(e) {
    setDuration(e.target.duration);
    if (e.target.offsetWidth) {
      setVideoWidth(e.target.offsetWidth);
    }
  }

  function frameBack() {
    incrFrame(-1);
  }

  function frameForward() {
    incrFrame(1);
  }

  function skipBack() {
    setTime(currTime - 0.5);
  }

  function skipForward() {
    setTime(currTime + 0.5);
  }

  function playPause() {
    if (isPaused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }

  function cancel() {
    setPointTimeOne(false);
    setPointTimeTwo(false);
  }

  function keydownHandler(e) {
    switch (e.key) {
      case ',':
        frameBack();
        break;
      case '.':
        frameForward();
        break;
      case 'ArrowLeft':
        skipBack();
        break;
      case 'ArrowRight':
        skipForward();
        break;
      case ' ':
      case 'Spacebar':
        playPause();
        break;
      case 'Escape':
        cancel();
        break;
      default:
    }
  }
  keydownHandlerRef.current = keydownHandler;

  useEffect(() => {
    const keyDown = (e) => keydownHandlerRef.current(e);
    document.addEventListener('keydown', keyDown);
    return () => document.removeEventListener('keydown', keyDown);
  }, []);

  function onClickVideo(e) {
    e.preventDefault();
    const { left, right, top, bottom } = e.target.getBoundingClientRect();
    const clientX = e.clientX - left;
    const clientY = e.clientY - top;
    const clientW = right - left;
    const clientH = bottom - top;

    const x = clientX / clientW;
    const y = clientY / clientH;
    const time = currTime;
    const pointTimeNew = { time, x, y };

    if (!pointTimeOne) {
      setPointTimeOne(pointTimeNew);
    } else if (!pointTimeTwo) {
      let diff = pointTimeNew.time - pointTimeOne.time; // Positive if pointTimeOne is earlier
      const sign = Math.sign(diff) || 1; // If diff is zero, treat as positive
      diff = Math.abs(diff);
      if (diff < 0.25) {
        pointTimeOne.time -= sign * ((0.25 - diff) / 2);
        pointTimeNew.time += sign * ((0.25 - diff) / 2);
      }
      pointTimeOne.time = Math.max(Math.min(pointTimeOne.time, duration || Infinity), 0);
      pointTimeNew.time = Math.max(Math.min(pointTimeNew.time, duration || Infinity), 0);
      setPointTimeOne(pointTimeOne);
      setPointTimeTwo(pointTimeNew);
      e.target.pause();
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

  function handleSubmit(e) {
    const option = e.target.value;

    dataObj[videoID].push({
      type: option,
      points: [pointTimeOne, pointTimeTwo],
    });

    setPointTimeOne(false);
    setPointTimeTwo(false);
  }

  function deleteRectangle(rect) {
    dataObj[videoID] = dataObj[videoID].filter((el) => (JSON.stringify(el) !== JSON.stringify(rect)));
    setForceUpdate((x) => !x);
  }

  function seekFromBar(e) {
    e.preventDefault();
    const { left, right } = e.target.getBoundingClientRect();
    const clientX = e.clientX - left;
    const clientW = right - left;

    if (duration) {
      const t = (clientX / clientW) * duration;
      setTime(t);
    }
  }

  return (
    <div id="video-container">
      <video
        id="main-video"
        src={videoURL}
        autoPlay
        ref={videoRef}
        onLoadedMetadata={handleReady}
        onTimeUpdate={timeUpdate}
        onPause={pauseHandler}
        onPlay={playHandler}
        onClick={onClickVideo}
      />
      <div
        id="progress-bar-outer"
        style={videoWidth ? { width: videoWidth } : {}}
        onClick={seekFromBar}
      >
        <div
          id="progress-bar"
          style={{ width: currTime && duration
            ? `${(currTime / duration) * 100}%`
            : '0%' }}
        />
        { dataObj[videoID].map(({ points: [p1, p2] }, i) => (
          <>
            <div
              className="marker-container"
              style={{ left: `${(Math.min(p1.time, p2.time) / duration) * 100}%` }}
            >
              <svg className="marker" viewBox="0 0 50 100" fill={`rgb(${colors[i % colors.length].join()})`}>
                <polygon points="0,0 0,100 50,50" />
              </svg>
            </div>
            <div
              className="marker-container"
              style={{ left: `${(Math.max(p1.time, p2.time) / duration) * 100}%`, transform: 'translate(-100%, 0%)' }}
            >
              <svg className="marker" viewBox="0 0 50 100" fill={`rgb(${colors[i % colors.length].join()})`}>
                <polygon points="50,0 50,100 0,50" />
              </svg>
            </div>
          </>
        )) }
        {
          pointTimeOne && (
            <div
              className="marker-container"
              style={{ left: `${(pointTimeOne.time / duration) * 100}%`, transform: 'translate(-50%, 0%)' }}
            >
              <svg
                className="marker"
                viewBox="0 0 50 100"
                fill={`rgb(${colors[dataObj[videoID].length % colors.length].join()})`}
              >
                <polygon points="0,-50 0,100 50,100 50,-50" />
              </svg>
            </div>
          )
        }
        {
          pointTimeTwo && (
            <div
              className="marker-container"
              style={{ left: `${(pointTimeTwo.time / duration) * 100}%`, transform: 'translate(-50%, 0%)' }}
            >
              <svg
                className="marker"
                viewBox="0 0 50 100"
                fill={`rgb(${colors[dataObj[videoID].length % colors.length].join()})`}
              >
                <polygon points="0,-50 0,100 50,100 50,-50" />
              </svg>
            </div>
          )
        }
      </div>
      <div id="controls-container" style={videoWidth ? { width: videoWidth } : {}}>
        <div
          className="button-container"
          style={{ height: '75%' }}
          onClick={skipBack}
        >
          <svg className="button" viewBox="0 0 100 100">
            <title>Skip backward half a second (Left arrow)</title>
            <polygon points="90,20 90,80 45,50" />
            <polygon points="55,20 55,80 10,50" />
          </svg>
        </div>

        <div
          className="button-container"
          style={{ height: '75%' }}
          onClick={frameBack}
        >
          <svg className="button" viewBox="0 0 100 100">
            <title>Skip backward one frame (Comma)</title>
            <polygon points="80,20 80,80 20,50" />
            <polygon points="35,20 20,20 20,80 35,80" />
          </svg>
        </div>

        <div
          className="button-container"
          style={{ height: '90%' }}
          onClick={playPause}
        >
          <svg className="button" viewBox="0 0 100 100">
            <title>Play/Pause (Spacebar)</title>
            {isPaused
              ? <polygon points="20,10 20,90 80,50" />
              : (
                <>
                  <polygon points="20,10 40,10 40,90 20,90" />
                  <polygon points="60,10 80,10 80,90 60,90" />
                </>
              )}
          </svg>
        </div>

        <div
          className="button-container"
          style={{ height: '75%' }}
          onClick={frameForward}
        >
          <svg className="button" viewBox="0 0 100 100">
            <title>Skip forward one frame (Period)</title>
            <polygon points="20,20 20,80 80,50" />
            <polygon points="65,20 80,20 80,80 65,80" />
          </svg>
        </div>

        <div
          className="button-container"
          style={{ height: '75%' }}
          onClick={skipForward}
        >
          <svg className="button" viewBox="0 0 100 100">
            <title>Skip forward half a second (Right arrow)</title>
            <polygon points="10,20 10,80 55,50" />
            <polygon points="45,20 45,80 90,50" />
          </svg>
        </div>
      </div>
      {dataObj[videoID].map((rect, i) => {
        const { type, points: [p1, p2] } = rect;
        if (!(((p1.time <= currTime) && (p2.time >= currTime))
        || ((p2.time <= currTime) && (p1.time >= currTime)))) {
          return null;
        }
        const rectStyle = getRectangleStyle(p1.x, p1.y, p2.x, p2.y, i);
        return (
          <div
            key={i}
            className="rectangle"
            style={rectStyle}
          >
            <span className="rectText">{type}</span>
            <div className="x-button-container">
              <svg className="x-button" viewBox="0 0 100 100" onClick={() => deleteRectangle(rect)}>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={rectStyle.outlineColor}
                  fill={rectStyle.outlineColor}
                  strokeWidth="10"
                />
                <line
                  x1="20"
                  y1="20"
                  x2="80"
                  y2="80"
                  strokeWidth="10"
                  stroke="black"
                />
                <line
                  x1="20"
                  y1="80"
                  x2="80"
                  y2="20"
                  strokeWidth="10"
                  stroke="black"
                />
              </svg>
            </div>
          </div>
        );
      })}
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
          <button className="btn" type="button" onClick={cancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoContainer;
