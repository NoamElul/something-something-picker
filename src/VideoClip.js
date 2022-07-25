import './VideoClip.css';
import React, { useRef, useState } from 'react';

const colors = [
  [255, 0, 0], // Red
  [0, 0, 255], // Blue
  [0, 255, 0], // Green
  [255, 170, 0], // Orange
  [255, 0, 255], // Purple
  [255, 255, 0], // Yellow
];

const options = ['touch', 'release', 'slide', 'roll'];

function VideoClip({ videoURL, startSecs, endSecs, dataObj }) {
  const fragmentID = `${startSecs}-${endSecs}`;
  if (typeof dataObj[fragmentID] === 'undefined') {
    dataObj[fragmentID] = [];
  }

  const [pointOne, setPointOne] = useState(false);
  const [pointTwo, setPointTwo] = useState(false);

  const videoRef = useRef(null);

  function timeUpdate(e) {
    if (e.target.currentTime > endSecs || e.target.currentTime < startSecs) {
      e.target.pause();
      e.target.currentTime = startSecs;
    }
    e.target.play();
  }

  function onClick(e) {
    e.preventDefault();
    const { left, right, top, bottom } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const w = right - left;
    const h = bottom - top;

    const point = [x / w, y / h];

    if (!pointOne) {
      setPointOne(point);
    } else if (!pointTwo) {
      setPointTwo(point);
    }
  }

  function getRelativePositionOfPoint([px, py]) {
    const videoRect = videoRef.current.getBoundingClientRect();
    const videoW = videoRect.right - videoRect.left;
    const videoH = videoRect.bottom - videoRect.top;
    const videoX = videoRef.current.offsetLeft;
    const videoY = videoRef.current.offsetTop;

    const pxAdjusted = (px * videoW) + videoX;
    const pyAdjusted = (py * videoH) + videoY;

    return [pxAdjusted, pyAdjusted];
  }

  function getPointStyle(p, i) {
    const color = colors[i % colors.length];
    const [pxAdjusted, pyAdjusted] = getRelativePositionOfPoint(p);

    return ({
      outlineColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      left: pxAdjusted,
      top: pyAdjusted,
    });
  }

  function getRectangleStyle(p1, p2, i) {
    const color = colors[i % colors.length];

    const [p1xAdjusted, p1yAdjusted] = getRelativePositionOfPoint(p1);
    const [p2xAdjusted, p2yAdjusted] = getRelativePositionOfPoint(p2);
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
    setPointOne(false);
    setPointTwo(false);
  }

  function handleSubmit(e) {
    const option = e.target.value;

    dataObj[fragmentID].push({
      type: option,
      points: [pointOne, pointTwo],
    });

    setPointOne(false);
    setPointTwo(false);
  }

  return (
    <div className="videoClipContainer">
      <video
        src={`${videoURL}#t=${startSecs},${endSecs}`}
        onTimeUpdate={timeUpdate}
        autoPlay
        loop
        onClick={onClick}
        ref={videoRef}
      />
      {dataObj[fragmentID].map(({ type, points: [p1, p2] }, i) => (
          <div
            key={i}
            className="rectangle"
            style={getRectangleStyle(p1, p2, i)}
          >
            <span className="rectText">{type}</span>
          </div>
      ))}
      {pointOne && pointTwo && (
          <div
            key={dataObj[fragmentID].length}
            className="rectangle"
            style={getRectangleStyle(pointOne, pointTwo, dataObj[fragmentID].length)}
          />
      )}
      {pointOne && (
        <span
          className="dot"
          style={getPointStyle(pointOne, dataObj[fragmentID].length)}
        />
      )}
      {pointTwo && (
        <span
          className="dot"
          style={getPointStyle(pointTwo, dataObj[fragmentID].length)}
        />
      )}
      {pointOne && pointTwo && (
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
    </div>
  );
}

export default VideoClip;
