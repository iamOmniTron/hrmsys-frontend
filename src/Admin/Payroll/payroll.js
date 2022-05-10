import axios from "axios";
import {useState,useEffect, useContext} from "react";
import { Flex,Button,Box,Spacer,Heading,Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,useToast } from "@chakra-ui/react";
import AuthContext from "../../contexts/auth";
import Loader from "../../Components/loader";
import Row from "./row";
import NoRecord from "../../Components/norecord";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function Payroll(){
    const [records,setRecords] = useState([]);
    const [token,_] = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(()=>{
        const fetchSalaries = async ()=>{
            const {data:response}= await axios.get(`${SERVER_URL}/employees/salaries`,{
                headers:{
                    "Authorization": `Bearer ${token}`
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
                setRecords([...response.data]);
              }
              return setIsLoading(false);
        }
        fetchSalaries();
    },[token]);

    return (
        isLoading?
        <Loader/> :
        <>
        <Flex direction="column"  minHeight="100vh">
        <Flex direction="row">
            <Box p="2px">
                <Heading size="md">Employees Payroll</Heading>
            </Box>
            <Spacer/>
        </Flex>
        <TableContainer overflowX="auto">
        <Table variant='simple'>
        <Thead>
        <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Level</Th>
            <Th>Status</Th>
            <Th>Salary</Th>
            <Th>Paid</Th>
        </Tr>
        </Thead>
        <Tbody>
        {
            records.length >0 ? records.map((record,index)=>{
            return (<Row key={index} prop={record}/>);
            }):
            <NoRecord/>
        }
        </Tbody>
        </Table>
        </TableContainer>
            </Flex>
        </>
    )

}