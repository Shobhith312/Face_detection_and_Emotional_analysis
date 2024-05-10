let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);// Create the video: ವೀಡಿಯೊ ವಸ್ತುವನ್ನು ರಚಿಸಿ
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Initialize the model: ಮಾದರಿಯನ್ನು ಪ್ರಾರಂಭಿಸುವುದು
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces: ಮುಖ ಓದುವಿಕೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ
}

// Got faces: ಮುಖವನ್ನು ಪತ್ತೆ ಮಾಡಿ
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections: ಪತ್ತೆಯಾದ ಎಲ್ಲಾ ಡೇಟಾವು ಈ ಪತ್ತೆಯಲ್ಲಿದೆ
  // console.log(detections);

  clear();//Draw transparent background;: ಪಾರದರ್ಶಕ ಹಿನ್ನೆಲೆಯನ್ನು ಸೆಳೆಯಿರಿ
  drawBoxs(detections);//Draw detection box: ಮುಖದ ಸುತ್ತಲೂ ಚೌಕವನ್ನು ಚಿತ್ರಿಸುವುದು
  drawLandmarks(detections);//// Draw all the face points: ಎಲ್ಲಾ ಮುಖ ಬಿಂದುಗಳನ್ನು ಚಿತ್ರಿಸುವುದು
  drawExpressions(detections, 20, 250, 14);//Draw face expression: ಮುಖದ ಅಭಿವ್ಯಕ್ತಿಗಳನ್ನು ಚಿತ್ರಿಸುವುದು

  faceapi.detect(gotFaces);// Call the function again at here: ಗುರುತಿಸುವಿಕೆ ಕಾರ್ಯಗತಗೊಳಿಸುವ ಕಾರ್ಯವನ್ನು ಇಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಕರೆ ಮಾಡಿ
}

function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected:ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಮುಖ ಪತ್ತೆಯಾದರೆ
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected: ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಮುಖ ಪತ್ತೆಯಾದರೆ
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected: ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಮುಖ ಪತ್ತೆಯಾದರೆ
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    fill(44, 169, 225);

    text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
    text("happiness: " + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    text("anger:        " + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    text("disgusted: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    text("fear:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
  }else{//If no faces is detected: ಯಾವುದೇ ಮುಖ ಪತ್ತೆಯಾಗದಿದ್ದರೆ ಏನು?
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("anger: ", x, y + textYSpace*2);
    text("sad: ", x, y + textYSpace*3);
    text("disgusted: ", x, y + textYSpace*4);
    text("surprised: ", x, y + textYSpace*5);
    text("fear: ", x, y + textYSpace*6);
  }
}