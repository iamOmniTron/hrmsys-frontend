import {useState,useEffect} from "react";
import {VStack,FormControl,Input,FormLabel,Button,Flex,useColorModeValue,Stack,useToast,Box,Heading} from "@chakra-ui/react";
import Camera from "./camComponent";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function LoginUser(){
    const toast = useToast();
    const [email,setEmail] = useState("");
    const [step,setStep] = useState(1);
    const [password,setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false);
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
            setUrls([...response.data]);
            setStep(2)
            console.log(urls);
        return setIsLoading(false);

    }

    useEffect(()=>{
        console.log(step);
    },[])


    return(
        <>
        
        <VStack>
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
                                // setStep(2)
                            }}>
                        Next
                    </Button>
                </Flex>
                </Box>
            </Stack>
            </Flex>
            </div>
            <div className={`${step !==2 && "d-none"}`}>
            <Flex>
                <Camera setStep={setStep}/>
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
                                setStep(3)
                            }}>
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