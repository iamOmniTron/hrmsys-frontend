import {useState,useEffect,useContext} from "react";
import axios from "axios";
import AuthContext from "../contexts/auth";
import {Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue, useToast,Text } from "@chakra-ui/react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Profile(){
    const [token,_] = useContext(AuthContext);
    const [user,setUser] = useState({});
    const [isLoading,setIsLoading] = useState(false);
    const toast = useToast();

    const STATUSES = {
        "1":"Active",
        "2":"On Training",
        "3":"On Leave",
        "4":"Retired"
    }

    useEffect(()=>{
        const getUser = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/profile`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            if (!response || typeof response.error == "string") {
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })
                return setIsLoading(false);
            }
            if (!response.success) {
                toast({
                    title: response.message ? response.message : "network error",
                    status: "error",
                    isClosable: true
                })
                return setIsLoading(false);
            }
            if (response.success) {
                setIsLoading(false);
                setUser(response.data);
            }
            return;

        }
    },[token]);
    return(
        <>
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Profile</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}  
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <Text> Firstname : {user.firstname}</Text>
              <Text> Lastname : {user.lastname}</Text>
              <Text> Middlename : {user.middlename}</Text>
              <Text> E-mail : {user.email}</Text>
              <Text> Phone : {user.phone}</Text>
              <Text> Gender :{user.gender}</Text>
              <Text> Level :{user.Profession.name} </Text>
              <Text> Salary :{user.Profession.salary}</Text>
              <Text> Status :{STATUSES[user.status.toString()]}</Text>
              <Stack spacing={10}>
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
        </Stack>
      </Flex>
          </>
    )
}