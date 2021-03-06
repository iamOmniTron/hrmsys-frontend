import {useState, useEffect, useContext} from "react";
import AuthContext from "../../contexts/auth";
import {
    Flex, Button, Box, Spacer, Heading, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer, useToast
} from "@chakra-ui/react";
import {MdAdd} from "react-icons/md"
import Row from "./row";
import NoRecord from "../../Components/norecord";
import axios from "axios";
import Loader from "../../Components/loader";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function Program() {
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [token, _] = useContext(AuthContext);
    const toast = useToast();

    useEffect(() => {
        const fetchPrograms = async () => {
            const {data: response} = await axios.get(`${SERVER_URL}/trainings/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response || typeof response.error == "string") {
                setIsLoading(false)
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })
                return;
            }
            if (!response.success) {
                setIsLoading(false)
                toast({
                    title: response.message ? response.message : "network error",
                    status: "error",
                    isClosable: true
                })
                return;
            }
            if (response.success) {
                setIsLoading(false)
                setPrograms(response.data);
            }
            return;
        }
        fetchPrograms();
    }, [token]);
    return (
        isLoading ?
            <Loader/> :
            <>
                <Flex direction="column" minHeight="100vh">
                    <Flex direction="row" justifyContent="space-between">
                        <Box p="2px">
                            <Heading size="md">Programs</Heading>
                        </Box>
                        <Spacer/>
                        <Button leftIcon={<MdAdd/>} colorScheme='blue'>Add </Button>
                    </Flex>
                    <TableContainer overflowX="auto">
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Program</Th>
                                    <Th>Duration</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    programs.length > 0 ? programs.map((program, index) => {
                                            return (<Row key={index} prop={program}/>);
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