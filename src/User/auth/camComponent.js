import {useRef,useCallback,useState} from "react";
import WebCam from "react-webcam";
import {Flex,VStack,Button,Image} from "@chakra-ui/react";
import {FiCamera} from "react-icons/fi"

const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
  }

export default function Camera({camRef,handleCapture}){
    const [image,setImage] = useState("");
    const vidRef = useRef(null)
    const capture = useCallback(
        () => {
          const imageSrc = vidRef.current.getScreenshot();
          setImage(imageSrc);
         image !== "" && handleCapture();
        },
        [vidRef,image]
      );
    return(
        image !== ""? <img src={image} crossOrigin="anonymous" height={"650"} width={"940"} ref={camRef}/> :
        <>
       
        <Flex>
            <VStack>
            <WebCam audio={false} ref={vidRef}
                    height={100}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                    width={280}
                    mirrored={true} />
                    <Button leftIcon={<FiCamera/>} bg={'blue.400'}
                        color={'white'}
                        _hover={{
                        bg: 'blue.500',
                        }} 
                        onClick={(e)=>{
                            capture();
                        }}
                        >Snap</Button>
            </VStack>
        </Flex>
        </>
    )
}
