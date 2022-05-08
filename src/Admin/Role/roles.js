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
import {useNavigate} from "react-router-dom";
import Loader from "../../Components/loader";
import NoRecord from "../../Components/norecord";
import Row from "./row";
import AuthContext from "../../contexts/auth";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Roles(){
    const [roles,setRoles] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [token,_] = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    const redirect = (e)=>{
      navigate("/admin/dashboard/role/add");
    }

    useEffect(()=>{
        const fetchRoles = async ()=>{
              setIsLoading(true);
            const {data:response} = await axios.get(`${SERVER_URL}/professions/all`,{
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
              setRoles([...response.data]);
            
            return setIsLoading(false);
      
          }
          fetchRoles();
    },[token])
    return(
        isLoading ?
        <Loader/> :
        <>
       <Flex direction="column"  minHeight="100vh">
           <Flex direction="row" justifyContent="space-between" borderBottom={'1px'} pb={'8px'}>
               <Box p="2px">
                   <Heading size="md">Job Levels</Heading>
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
       <Th>Name</Th>
       <Th>Salary</Th>
       <Th></Th>
     </Tr>
   </Thead>
   <Tbody>
     {
       roles.length >0 ? roles.map((role,index)=>{
        return(<Row key={index} prop={role}/>);
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