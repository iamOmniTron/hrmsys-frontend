import * as faceapi from "face-api.js";
import {useState,useEffect,useRef,useContext} from "react";
import {VStack,FormControl,Input,FormLabel,Button,Flex,useColorModeValue,Stack,useToast,Box,Heading} from "@chakra-ui/react";
import AuthContext from "../../contexts/auth";
import {useNavigate} from "react-router-dom";
import Camera from "./camComponent";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function LoginUser(){
    const navigate = useNavigate();
    const camRef = useRef(null);
    const toast = useToast();
    const [email,setEmail] = useState("");
    const [step,setStep] = useState(1);
    const [password,setPassword] = useState("");
    const [token,setToken] = useContext(AuthContext);
    const [urls,setUrls] = useState("");

    const handleEmailOnSubmit = async()=>{
                const {data:response} = await axios.get(`${SERVER_URL}/auth/employee/${email}`
                );
                
        if(!response || typeof response.error === "string"){
            setIsLoading(false)
            toast({
            title:response.error ? response.error :"network error",
            status:"error",
            isClosable:true
            })
            
            return;
        }
        if(response.success === false){
            setIsLoading(false);
            toast({
            title:response.message ? response.message :"network error",
            status:"error",
            isClosable:true
            })
            
            return ;
        }
        if(response.data == ""){
            setIsLoading(false);
            toast({
            title:"Employee record not found, contact admin",
            status:"error",
            isClosable:true
            });
            // navigate('/login')
            return;
        }
            setUrls([...response.data]);
            setStep(2)
            console.log(urls);
        return setIsLoading(false);

    }

    const handleImage = async ()=>{

        try{
            console.log("ref",camRef);
            const detections = await faceapi.detectSingleFace(camRef.current,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
            console.log(detections);
            if(!detections.length){
                // navigate("/login");
                toast({
                    title:"Invalid Face Id",
                    status:"error",
                    isClosable:true
                    });
                    return;
            }
            const faceMatcher = new faceapi.FaceMatcher(detections,0.5);
            const imageUrl = `${SERVER_URL}/${urls[0]}`;
    
            const result = await faceapi.detectSingleFace(imageUrl).withFaceLandmarks().withFaceDescriptor();
    
            if(!result){
                // navigate("/login");
                toast({
                    title:"Cannot Match Face",
                    status:"error",
                    isClosable:true
                });
                return;
            }
    
            const bestMatch = faceMatcher.findBestMatch(result.descriptor);
            // console.log(bestMatch.toString());
            if(bestMatch){
                setStep(3);
            }
        }catch(e){
            console.log(e);
            toast({
                title:"Something went wrong, contact admin",
                status:"error",
                isClosable:true
                });
        }
        
    }

    const handleSubmit = async ()=>{
        const {data:response} = await axios.post(`${SERVER_URL}/auth/employee/login`,{
            email,password
        },{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
        if(!response || typeof response.error === "string"){
            setIsLoading(false)
            toast({
            title:response.error ? response.error :"network error",
            status:"error",
            isClosable:true
            })
            
            return;
        }
        if(response.success === false){
            setIsLoading(false);
            toast({
            title:response.message ? response.message :"network error",
            status:"error",
            isClosable:true
            })
            
            return ;
        }
        if(response.data == ""){
            setIsLoading(false);
            toast({
            title:"Cannot Login, contact Admin",
            status:"error",
            isClosable:true
            });
            // navigate('/login')
            return;
        }
            setIsLoading(false);
            setToken(response.data);
            navigate("/user/dashboard");
    }


    useEffect(()=>{
        const loadModels = async ()=>{
            const MODEL_URL = "/models"
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
              ]).then(()=>{
                  console.log('loaded');
        })}
      camRef && loadModels();
    },[])


    return(
        <>
        <VStack>
            <Heading>Employee Login</Heading>
        <div className={`${step !==1 && "d-none"}`}>
        <Flex minH="100vh" justify="center" align="center" bg={useColorModeValue('gray.50', 'gray.800')} >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack>Login With Your Email</Stack>
            <Box
                rounded={'lg'} 
                bg={useColorModeValue('white', 'gray.700')}  
                boxShadow={'lg'}
                p={8}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </FormControl>
                <Flex align="center" justify="center" pt="2">
                    <Button bg={'blue.400'}
                            color={'white'}
                            _hover={{
                            bg: 'blue.500',
                            }} onClick={(e)=>{
                                handleEmailOnSubmit();
                            }} isLoading={isLoading}>
                        Next
                    </Button>
                </Flex>
                </Box>
            </Stack>
            </Flex>
            </div>
            <div className={`${step !==2 && "d-none"}`}>
            <Flex>
                <Camera camRef={camRef} handleCapture={handleImage}/>
                {/* <img crossOrigin="anonymous" ref={camRef} src="http://localhost:3000/me.jpg" height={"650"} width={"940"}/> */}
            </Flex>
            </div>
            <div className={`${step !==3 && "d-none"}`}>
            <Flex  minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.800')} >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="enter password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </FormControl>
                <Flex align="center" justify="center" pt="2">
                    <Button bg={'blue.400'}
                            color={'white'}
                            _hover={{
                            bg: 'blue.500',
                            }} onClick={(e)=>{
                                handleSubmit()
                            }} isLoading={isLoading}>
                        Submit
                    </Button>
                </Flex>
            </Stack>
            </Flex>
            </div>
        </VStack>
        </>
    )
}