import {useState,useContext,useEffect} from "react";
import {Flex,Button,Box,Spacer,Heading,Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,useToast} from "@chakra-ui/react";
import {MdAdd} from "react-icons/md";
import Loader from "../../Components/loader";
import NoRecord from "../../Components/norecord";
import Row from "./row";
import AuthContext from "../../contexts/auth";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function Skills(){
    const [token,_] = useContext(AuthContext);
    const [skills,setSkills] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const toast = useToast();


    useEffect(()=>{
      setIsLoading(true)
        const fetchSkills = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/skills/all`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            
      if(!response || typeof response.error == "string"){
        setIsLoading(false)
        console.log("1");
        toast({
          title:response.error ? response.error :"network error",
          status:"error",
          isClosable:true
        })
         
        return;
      }
      if(response.success == false){
        setIsLoading(false)
        console.log("2")
        toast({
          title:response.message ? response.message :"network error",
          status:"error",
          isClosable:true
        })
        
        return ;
      }
        setSkills([...response.data]);
      
      return setIsLoading(false);

        }
        fetchSkills();
    },[token])
    return (
        isLoading ? <Loader/>
        :
        <>
              <Flex direction="column"  minHeight="100vh">
            <Flex direction="row" justifyContent="space-between">
                <Box p="2px">
                    <Heading size="md">Skills Details</Heading>
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
                            <Th>Name</Th>
                            <Th></Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        {
                            skills.length >0 ? skills.map((skill,index)=>{
                              return(
                                <Row key={index} prop={skill}/>
                              )
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