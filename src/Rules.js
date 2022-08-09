/* eslint-disable react/jsx-one-expression-per-line */
import './Rules.css';
import React from 'react';

function Rules() {
  return (
    <div id="rules">
      <h1>Instructions</h1>
      <div className="text">
        <h2>Task</h2>
        <p>
          In this HIT you will be asked to mark contact events between objects
          in a video. Specifically, you will be asked to mark when two objects <b>touch</b>,
          when they <b>stop&nbsp;touching</b>, and when they <b>slide against each other</b>.
        </p>

        <p>
          To mark a contact event, click on two points in the video to create
          a box between them. The box should be at approximately the time and
          place in the video where the contact event occured.
          A popup will then appear asking whether this event is two objects
          touching, stopping to touch, or sliding.
        </p>
        <p>
          If you click on points at two different times in the video, then the box
          will exist between those two points in time. This is used to mark when
          a contact event occurs over more than one frame. For example, if two
          objects slide against each other for several seconds,
          or if someone begins grabbing an object in one frame
          but it takes them a second to fully grasp it.
        </p>
        <p>
          Note that for a &apos;Touch&apos; or &apos;Stop Touching&apos; event,
          you are only marking <b>the moment that contact events occur</b>.
          For example, you would not make a box over the entire time that two
          objects are touching, you would only make a box
          on <b>the moment when they come into contact.</b> For
          a sliding event, you mark the entire time that the objects are sliding against each other.
        </p>
        <p>
          When you are done marking all contact events in the video,
          click the &apos;Submit&apos; button.
        </p>
      </div>
      <div className="text">
        <h2>Controls and Hotkeys</h2>
        <p>Use the space bar to play/pause the video</p>
        <p>Use the left and right arrow keys to skip forward/back half a second</p>
        <p>Use the period and comma keys to skip forward/back one frame</p>
        <p>Use the escape key to cancel creating a box</p>
        <p>Click the &apos;X&apos; button on the top left of a box to delete it</p>
      </div>
      <div className="text">
        <h2>Examples</h2>
        <div>
          <h3>First example (Touch and Stop Touching)</h3>
          <p>We are annotating this video of a hand grabbing then releasing a pillow:</p>
          <video
            src={`${process.env.PUBLIC_URL}/examples/2/original.webm`}
            controls
            preload="metadata"
            className="rule-vid"
          />
          <p>The hand begins grabbing the pillow in this frame, so we make a point here:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/a1.png`} alt="" className="rule-img" />
          <p>The hand has completely grabbed the pillow in this frame, so we make another point:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/a2.png`} alt="" className="rule-img" />
          <p>We select &apos;Touch&apos; from the popup:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/a3.png`} alt="" className="rule-img" />
          <p>Which leaves us with this box:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/a4.png`} alt="" className="rule-img" />
          <p>The hand begins releasing the pillow in this frame, so we make a point here:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/b1.png`} alt="" className="rule-img" />
        <p>The hand has completely released the pillow in this frame, so we make another point:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/b2.png`} alt="" className="rule-img" />
          <p>We select &apos;Stop Touching&apos; from the popup:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/b3.png`} alt="" className="rule-img" />
          <p>Which leaves us with this box:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/2/b4.png`} alt="" className="rule-img" />
          <p>The final result looks like this:</p>
          <video
            src={`${process.env.PUBLIC_URL}/examples/2/annotated.mp4`}
            controls
            preload="metadata"
            className="rule-vid"
          />
          <h3>Second example (Sliding)</h3>
          <p>We are annotating this video of a finger sliding a USB stick along the floor:</p>
          <video
            src={`${process.env.PUBLIC_URL}/examples/7/original.webm`}
            controls
            preload="metadata"
            className="rule-vid"
          />
        <p>The USB stick begins sliding along the floor in this frame, so we make a point here:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/7/a1.png`} alt="" className="rule-img" />
          <p>The USB stick stops sliding at the end of the video, so we make another point here:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/7/a2.png`} alt="" className="rule-img" />
          <p>
            The box looks like this.
            Note that the box covers the entire area that the USB slid over, and
            the entire time that the USB was sliding:
          </p>
          <img src={`${process.env.PUBLIC_URL}/examples/7/a3.png`} alt="" className="rule-img" />
          <p>We also have to annotate the moment the finger touches the USB stick:</p>
          <img src={`${process.env.PUBLIC_URL}/examples/7/b1.png`} alt="" className="rule-img" />
          <p>The final result looks like this:</p>
          <video
            src={`${process.env.PUBLIC_URL}/examples/7/annotated.mp4`}
            controls
            preload="metadata"
            className="rule-vid"
          />
          <h3>Third example (A complex video)</h3>
          <p>
            Some vidoes contain many contact events.
            In this video, we must annotate every time each of the man&apos;s hands
            touch or stop touching a book, and each time a book touches the floor
            or stops touching the floor:
          </p>
          <video
            src={`${process.env.PUBLIC_URL}/examples/3/annotated.mp4`}
            controls
            preload="metadata"
            className="rule-vid"
          />
        </div>
      </div>
    </div>
  );
}

export default Rules;
