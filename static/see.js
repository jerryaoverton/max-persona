// connect the video ui element used for face recognition
const video = document.getElementById('video');

// load the neural network models needed for face detection
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/static/models')
]).then(startVideo);

// connect to the camera and stream the video to the ui
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );
}

// variable used to stored the thread that runs periodically and
// detects faces
//
var interval;

// procedure for detecting faces and drawing the result on a canvas
// that overlays the video
//
function detectFaces(){
    // connect to the canvas that overlays the video
    // this canvas is used to draw the result of face
    // detection directly over the live video
    //
    const canvas = document.getElementById('canvas');

    // adjust the canvas to match the current size of the video
    // this adjustment is needed when the video is resized
    //
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
    faceapi.matchDimensions(canvas, displaySize);

    // clear the previous thread responsible for drawing on the canvas
    // without this step, there will be more than one output drawn
    // to the screen
    //
    clearInterval(interval);

    // kick off a thread that detects faces and draws the results
    // to the video on the screen
    //
    interval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
}

// start face detection when the video is started
video.addEventListener('play', detectFaces);

// reset face detection when the video is resized
window.addEventListener('resize', detectFaces);