import {Flex,Button,Box,Spacer,Heading,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,useToast} from "@chakra-ui/react";
import {MdAdd} from "react-icons/md";
import {useEffect,useState,useContext} from
"react";
import Loader from "../../Components/loader";
import Row from "./row";
import AuthContext from "../../contexts/auth";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Employees(){
  const [employees,setEmployees] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [token,_] = useContext(AuthContext);
  const toast = useToast();

  useEffect(()=>{

    const fetchEmployees = async ()=>{
        
      const {data:response} = await axios.get(`${SERVER_URL}/employees/all`,{
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
        setEmployees([...response.data]);
      }
      return setIsLoading(false);

    }
    fetchEmployees();
  },[token]);
    return(
      isLoading ?
         <Loader/> :
         <>
        <Flex direction="column"  minHeight="100vh">
            <Flex direction="row" justifyContent="space-between">
                <Box p="2px">
                    <Heading size="md">Employees Records</Heading>
                </Box>
                <Spacer/>
                <Box>
                    <Button leftIcon={<MdAdd/>} colorScheme='blue'>Add</Button>
                </Box>
            </Flex>
            <TableContainer overflowX="auto">
  <Table variant='simple'>
    <Thead>
      <Tr>
        <Th>Firstname</Th>
        <Th>Lastname</Th>
        <Th>Date Of Birth</Th>
        <Th>Profession</Th>
        <Th></Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        employees.length >0 && employees.map((employee,index)=>{
          <Row key={index} prop={employee}/>
        })
      }
    </Tbody>
  </Table>
</TableContainer>
        </Flex>
        </>
    )
}