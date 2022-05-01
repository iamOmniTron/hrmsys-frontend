import {useState,useContext,useEffect} from "react";
import Loader from "../../Components/loader";
import AuthContext from "../../contexts/auth";
import Row from "./row";
import NoRecord from "../../Components/norecord";
import axios from "axios";
import { Flex,Box,Spacer,Heading,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,useToast } from "@chakra-ui/react";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Attendance(){
    const toast = useToast();
    const [token,_] = useContext(AuthContext);
    const[sessions,setSessions] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        const fetchSessions = async()=>{
            setIsLoading(true);
            const {data:response} = await axios.get(`${SERVER_URL}/sessions`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            if(!response || typeof response.error == "string"){
                toast({
                  title:response.error ? response.error :"network error",
                  status:"error",
                  isClosable:true
                })
                return setIsLoading(false);
              }
              if(!response.success){
                toast({
                  title:response.message ? response.message :"network error",
                  status:"error",
                  isClosable:true
                })
                return setIsLoading(false);
              }
              if(response.success){
                setSessions([...response.data]);
              }
              return setIsLoading(false);
        }
        fetchSessions();

    },[token])
    return (
        isLoading?
        <Loader/> :
        <>
        <Flex direction="column"  minHeight="100vh">
        <Flex direction="row" justifyContent="space-between">
            <Box p="2px">
                <Heading size="md">Employee Attendance</Heading>
            </Box>
            <Spacer/>
        </Flex>
        <TableContainer overflowX="auto">
<Table variant='simple'>
<Thead>
  <Tr>
    <Th>Email</Th>
    <Th>Time In</Th>
    <Th>Time Out</Th>
  </Tr>
</Thead>
<Tbody>
  {
    sessions.length >0 ? sessions.map((session,index)=>{
     return (<Row key={index} prop={session}/>);
    })
    :
    <NoRecord/>
  }
</Tbody>
</Table>
</TableContainer>
    </Flex>
        </>
    )
}