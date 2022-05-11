import {
    Flex, Button, Box, Spacer, Heading, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer, useToast
} from "@chakra-ui/react";
import {MdAdd} from "react-icons/md";
import {useEffect, useState, useContext} from
        "react";
import {useNavigate} from "react-router-dom";
import Loader from "../../Components/loader";
import Row from "./row";
import NoRecord from "../../Components/norecord";
import AuthContext from "../../contexts/auth";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, _] = useContext(AuthContext);
    const toast = useToast();

    const redirect = (e) => {
        navigate("/admin/dashboard/employee/add");
    }

    useEffect(() => {

        const fetchEmployees = async () => {
            console.log(token)

            const {data: response} = await axios.get(`${SERVER_URL}/employees/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
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
                setEmployees([...response.data]);
            }
            return setIsLoading(false);

        }
        fetchEmployees();
    }, [token]);
    return (
        isLoading ?
            <Loader/> :
            <>
                <Flex direction="column" minHeight="100vh" width={'100%'}>
                    <Flex direction="row" justifyContent="space-between" borderBottom={'1px'} pb={'8px'}>
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
                                    <Th>Id</Th>
                                    <Th>Firstname</Th>
                                    <Th>Lastname</Th>
                                    <Th>Date Of Birth</Th>
                                    <Th>Level</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody width={'full'}>
                                {
                                    employees.length >0 ? employees.map((employee,index)=>{
                                     return (<Row key={index} prop={employee}/>);
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