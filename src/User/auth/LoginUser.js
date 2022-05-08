import * as faceapi from "face-api.js";
import {useState, useEffect, useRef, useContext} from "react";
import {
    VStack,
    FormControl,
    Input,
    FormLabel,
    Button,
    Flex,
    useColorModeValue,
    Stack,
    useToast,
    Box,
    Heading
} from "@chakra-ui/react";
import AuthContext from "../../contexts/auth";
import {useNavigate} from "react-router-dom";
import Camera from "./camComponent";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function LoginUser() {
    const navigate = useNavigate();
    const camRef = useRef(null);
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState("");
    const [token, setToken] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [urls, setUrls] = useState("");

    const handleEmailOnSubmit = async () => {
        axios.get(`${SERVER_URL}/auth/employee/${email}`).then(res => {
            let response = res.data
            if (response.success === false) {
                toast({
                    title: response.message ? response.message : "network error",
                    status: "error",
                    isClosable: true
                })

                return;
            }
            if (!response || typeof response.error === "string") {
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })

                return;
            }

            if (response.data == "") {
                setIsLoading(false);
                toast({
                    title: "Employee record not found, contact admin",
                    status: "error",
                    isClosable: true
                });
                // navigate('/login')
                return;
            }
            // successful
            setUrls([...response.data]);
            setStep(2)
            // console.log(urls);
        }).catch(e => {
            toast({
                title: "Invalid credentials",
                status: "error",
                isClosable: true
            })
        }).finally(() => {
            setIsLoading(false)
        })

    }

    // reload login page when authentication fails. added this because setting step to 1 still leaves image displayed in screen
    const reload = () => {
        let f = function(){
            window.location.reload()
        }
        // after two secs. this is to allow toasted message stay a bit long
        setTimeout(f, 2000)
    }

    const handleImage = async () => {

        try {
            console.log("ref", camRef);
            const detections = await faceapi.detectSingleFace(camRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
            console.log(detections);
            if (!detections) {
                // could not detect a face
                toast({
                    title: "Invalid Face Id",
                    status: "error",
                    isClosable: true
                });
                reload()
                return;
            }

            const name = urls[0].substring(0, urls[0].indexOf('-'))

            const imageUrl = `${SERVER_URL}/uploads/${name}/${urls[0]}`;

            // create image element from url
            const imageEl = document.createElement('img');
            imageEl.setAttribute('src', imageUrl)
            imageEl.setAttribute('crossorigin', 'anonymous')
            imageEl.onload = async function () {
                // console.log(imageEl.width)
                const result = await faceapi.detectSingleFace(imageEl).withFaceLandmarks().withFaceDescriptor();

                if (!result) {
                    // navigate("/login");
                    toast({
                        title: "Cannot Match Face",
                        status: "error",
                        isClosable: true
                    });
                    // setStep(1)
                    reload()
                    return;
                }

                const faceMatcher = new faceapi.FaceMatcher(new faceapi.LabeledFaceDescriptors(name, [result.descriptor]), .8);

                // const faceMatcher = new faceapi.FaceMatcher(detections,.6);

                const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
                console.log(bestMatch)
                if (bestMatch && bestMatch.label === name) {
                    setStep(3);
                } else{
                    toast({
                        title: "Face does not match",
                        status: "error",
                        isClosable: true
                    });
                    reload()
                }
            }


        } catch (e) {
            console.log(e);
            toast({
                title: "Something went wrong, contact admin",
                status: "error",
                isClosable: true
            });
            // setStep(1)
            reload()
        }

    }

    const handleSubmit = async () => {
        const {data: response} = await axios.post(`${SERVER_URL}/auth/employee/login`, {
            email, password
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response || typeof response.error === "string") {
            setIsLoading(false)
            toast({
                title: response.error ? response.error : "network error",
                status: "error",
                isClosable: true
            })

            return;
        }
        if (response.success === false) {
            setIsLoading(false);
            toast({
                title: response.message ? response.message : "network error",
                status: "error",
                isClosable: true
            })

            return;
        }
        if (response.data == "") {
            setIsLoading(false);
            toast({
                title: "Cannot Login, contact Admin",
                status: "error",
                isClosable: true
            });
            // navigate('/login')
            return;
        }
        setIsLoading(false);
        setToken(response.data);
        navigate("/user/dashboard");
    }


    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models"
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
            ]).then(() => {
                console.log('loaded');
            })
        }
        camRef && loadModels();
    }, [])


    return (
        <>
            <VStack>
                {/* <Heading>Employee Login</Heading> */}
                <div className={`${step !== 1 && "d-none"}`}>
                    <Flex minH="100vh" justify="center" align="center">
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                            <Stack>Login With Your Email</Stack>
                            <Box
                                rounded={'lg'}
                                boxShadow={'lg'}
                                p={8}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" placeholder="enter email" value={email}
                                           onChange={(e) => setEmail(e.target.value)}/>
                                </FormControl>
                                <Flex align="center" justify="center" pt="2">
                                    <Button bg={'blue.400'}
                                            color={'white'}
                                            mt={'10px'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }} onClick={(e) => {
                                        handleEmailOnSubmit();
                                    }} isLoading={isLoading}>
                                        Next
                                    </Button>
                                </Flex>
                            </Box>
                        </Stack>
                    </Flex>
                </div>
                <div className={`${step !== 2 && "d-none"}`}>
                    <Flex>
                        <Camera camRef={camRef} handleCapture={handleImage}/>
                        {/* <img crossOrigin="anonymous" ref={camRef} src="http://localhost:3000/me.jpg" height={"650"} width={"940"}/> */}
                    </Flex>
                </div>
                <div className={`${step !== 3 && "d-none"}`}>
                    <Flex minH="100vh" align="center" justify="center">
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                            <Box
                                rounded={'lg'}
                                boxShadow={'lg'}
                                p={8}>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="enter password" value={password}
                                           onChange={(e) => setPassword(e.target.value)}/>
                                </FormControl>
                                <Flex align="center" justify="center" pt="2">
                                    <Button bg={'blue.400'}
                                            color={'white'}
                                            mt={'10px'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }} onClick={(e) => {
                                        handleSubmit()
                                    }} isLoading={isLoading}>
                                        Submit
                                    </Button>
                                </Flex>
                            </Box>
                        </Stack>
                    </Flex>
                </div>
            </VStack>
        </>
    )
}