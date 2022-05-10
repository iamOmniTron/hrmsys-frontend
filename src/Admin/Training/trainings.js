import axios from "axios";
import {useState, useEffect, useContext} from "react";
import {
    Flex, Button, Box, Spacer, Heading, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer, useToast
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import Loader from "../../Components/loader";
import Row from "./row";
import NoRecord from "../../Components/norecord";
import {MdAdd} from "react-icons/md";
import AuthContext from "../../contexts/auth";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function Trainings() {
    const [trainings, setTrainings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const [token, _] = useContext(AuthContext);

    const redirect = (e) => {
        navigate("/admin/dashboard/trainings/add")
    }

    useEffect(() => {
        const fetchTrainings = async () => {
            const {data: response} = await axios.get(`${SERVER_URL}/trainings/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.success) {
                setTrainings([...response.data]);
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

            if (!response || typeof response.error == "string") {
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })
                return setIsLoading(false);
            }
        }
        fetchTrainings();
    }, [token]);
    return (
        isLoading ?
            <Loader/> :
            <>
                <Flex direction="column" minHeight="100vh">
                    <Flex direction="row" justifyContent="space-between">
                        <Box p="2px">
                            <Heading size="md">Employees Training Programs</Heading>
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
                                    <Th>Skill</Th>
                                    <Th>Duration</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    trainings.length > 0 ? trainings.map((training, index) => {
                                            return (<Row key={index} prop={training}/>);
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