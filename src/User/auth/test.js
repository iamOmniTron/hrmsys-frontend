import WebCam from "react-webcam";
import{useRef} from "react";


const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
  }
export default function Cam(){
    const snap = ()=>{
        const imgSrc = camRef.current.getScreenshot();
        console.log(imgSrc);
    }
    const camRef = useRef(null);
    return(
        <>
        <WebCam 
            ref={camRef}
            videoConstraints={videoConstraints}
            screenshotFormat="image/jpeg"
            width={280}
            mirrored={true}
        />
        <button onClick={snap}>Snap</button>
        </>
    )
}