import React,{useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import *as bodyPix from '@tensorflow-models/body-pix';
import './App.css';

function App() {


  const webcamRef = useRef(null)
  const canvasRef = useRef(null)



  const loadBodyPixModel = async()=>{
    const model = await bodyPix.load();
    console.log('Model loaded');
    setInterval(()=>{
      detectSegments(model);
    },100);
  }

  const detectSegments = async(model)=>{
    if(typeof webcamRef.current !=='undefined' && webcamRef.current !== null
    && webcamRef.current.video.readyState ===4)
    {
      const video = webcamRef.current.video;
      const vWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = vWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = vWidth;
      canvasRef.current.height = videoHeight;

      const pred = await model.segmentPersonParts(video)
     // console.log(pred);
     const colors = bodyPix.toColoredPartMask(pred);

     bodyPix.drawMask(
       canvasRef.current,
       video,
       colors,
       0.7,
       0,
       false
     );
     
      
    }
  }

  loadBodyPixModel();

  return (
    <div className="App">
      <header className="App-header">
      <Webcam
      ref = {webcamRef}
      muted = {true}
      style = {{
        position:'absolute',
        marginLeft:'auto',
        marginRight:'auto',
        left:0,
        right:0,
        textAlign:'center',
        zindex:9,
        width:640,
        height:480
      }}
      />

<canvas
      ref = {canvasRef}
      muted = {true}
      style = {{
        position:'absolute',
        marginLeft:'auto',
        marginRight:'auto',
        left:0,
        right:0,
        textAlign:'center',
        zindex:9,
        width:640,
        height:480
      }}
      />

      </header>

    </div>
  );
}

export default App;
