import {useRef,useCallback,useState} from "react";
import WebCam from "react-webcam";
import {Flex,VStack,Button,Image} from "@chakra-ui/react";
import {FiCamera} from "react-icons/fi"

const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
  }

export default function Camera({setStep}){
    const camRef = useRef(null);
    const [img,setImg] = useState("");
    const capture = useCallback(
        () => {
          const imageSrc = camRef.current.getScreenshot();
          setImg(imageSrc);
        },
        [camRef]
      );
    return(
        img !== ""? <Image src={img} height="300px" objectFit={"cover"}/> :
        <>
       
        <Flex>
            <VStack>
            <WebCam audio={false} ref={camRef}
                    height={100}
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
                            setStep(3)
                        }}
                        >Snap</Button>
            </VStack>
        </Flex>
        </>
    )
}
