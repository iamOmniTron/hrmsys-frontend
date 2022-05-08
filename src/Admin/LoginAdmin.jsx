import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue,
  } from '@chakra-ui/react';
  // import {GrUserAdmin} from "react-icons/gr";
  import {useState,useContext,useEffect} from "react";
  import axios from "axios";
  import AuthContext from "../contexts/auth";
  import {useNavigate} from "react-router-dom";
import AdminContext from '../contexts/admin';

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  

export default function LoginAdmin (){
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const [token,setToken] = useContext(AuthContext);
  const [_,setIsAdmin] = useContext(AdminContext);

  const handleLogin = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      const {data:response} = await axios.post(`${SERVER_URL}/admin/login`,{
        username,password
      });
      setUsername("");
      setPassword("");
      if(!response || typeof response.error == "string"){
        setError(response.error ? response.error : "something went wrong");
        setIsLoading(false);
        return;
      }
      if(!response.success){
        setError(response.message || "something went wrong");
        setIsLoading(false);
        return;
      }
      if(response.data && response.data.length >1){
        console.log(response.data)
        setToken(response.data);
        setIsAdmin(true);
        setIsLoading(false);
        navigate("/admin/dashboard/employees");
        return;
      }
      return;
    }catch(e){
        setError(e.message);
        setIsLoading(false);
    }

  }


  useEffect(()=>{
    console.log(token)
    const check = ()=>{
      if(token && token.length >1){
       return navigate("/admin/dashboard");
      }
      return;
    }

    check();

  },[token]);

    

    return (
        <>
         <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Log in as Administrator</Heading>
        </Stack>
        <form onSubmit={handleLogin}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}  
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }} type="submit" isLoading={isLoading}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
        </form>
      </Stack>
    </Flex>
        </>
    )
}