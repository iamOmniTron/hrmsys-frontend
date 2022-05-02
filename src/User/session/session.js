import {useState,useEffect,useContext} from "react";
import {Flex,Button,Box,Spacer,Heading,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,useToast} from "@chakra-ui/react";
  import Row from "./row";
import axios from "axios";
import AuthContext from "../../contexts/auth";
import NoRecord from "../../Components/norecord";
const SERVER_URL = process.env.SERVER_URL;

export default function Session(){
    const [token,_] = useContext(AuthContext);
    const toast = useToast();
    const [sessions,setSessions] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    useEffect(()=>{
        const fetchSessions = async ()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/session/user`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            if(!response || typeof response.error == "string"){
                setIsLoading(false)
                toast({
                  title:response.error ? response.error :"network error",
                  status:"error",
                  isClosable:true
                })
                return;
              }
              if(!response.success){
                setIsLoading(false)
                toast({
                  title:response.message ? response.message :"network error",
                  status:"error",
                  isClosable:true
                })
                return;
              }
              if(response.success){
                setIsLoading(false);
                setSessions([...response.data]);
              }
              return;
        }
        fetchSessions();
    },[token]);
    return (
        isLoading?
        <Loader/> :
        <>
        <Flex direction="column"  minHeight="100vh">
        <Flex direction="row" justifyContent="space-between">
            <Box p="2px">
                <Heading size="md">Employees Records</Heading>
            </Box>
            <Spacer/>
            <Box>
                <Button leftIcon={<MdAdd/>} colorScheme='blue' onClick={redirect}>Add</Button>
            </Box>
        </Flex>
        <TableContainer overflowX="auto">
<Table variant='simple'>
<Thead>
  <Tr>
    <Th>Day</Th>
    <Th>Time in</Th>
    <Th>Time out</Th>
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