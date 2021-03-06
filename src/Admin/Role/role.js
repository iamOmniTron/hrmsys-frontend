import {useParams, useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {
    Flex, Box, FormLabel, FormControl, Input, Button, Heading, HStack, Select, Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, useToast, useColorModeValue
} from "@chakra-ui/react";
import {MdDelete, MdSave} from "react-icons/md";
import AuthContext from "../../contexts/auth";
import Loader from "../../Components/loader";
import AdminContext from "../../contexts/admin";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Role() {
    const {id} = useParams();
    const toast = useToast();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [token] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [salary, setSalary] = useState("");
    const [name, setName] = useState("");
    const [isAdmin] = useContext(AdminContext);
    const [role, setRole] = useState({});
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const {data: response} = await axios.post(`${SERVER_URL}/profession/${id}`, {
            name, salary
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response || typeof response.error == "string") {
            setIsLoading(false);
            toast({
                title: response.error ? response.error : "network error",
                status: "error",
                isClosable: true
            })
            return;
        }
        if (!response.success) {
            setIsLoading(false);
            toast({
                title: response.message ? response.message : "network error",
                status: "error",
                isClosable: true
            })
            return;
        }
        if (response.success) {
            setIsLoading(false);
            navigate("/admin/dashboard/roles")
        }
    }


    useEffect(() => {
        const fetchRole = async () => {
            setIsLoading(true);
            const {data: response} = await axios.get(`${SERVER_URL}/profession/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response || typeof response.error == "string") {
                setIsLoading(false);
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })
                return;
            }
            if (!response.success) {
                setIsLoading(false);
                toast({
                    title: response.message ? response.message : "network error",
                    status: "error",
                    isClosable: true
                })
                return;
            }
            if (response.success) {
                setIsLoading(false);
                setRole(...response.data);
            }
            return;
        }

        // checkIsLoggedIn(token);
        // checkIsAdmin(isAdmin);
        fetchRole();
    }, [token, id]);


    return (
        isLoading ? <Loader/> :
            <>
                <PopUp isOpen={isOpen} onClose={onClose} id={id} token={token} toast={toast}/>
                <Flex direction="column" minHeight="100vh">
                    <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6} boxShadow={'x'}
                           bg={'whiteAlpha.700'}>
                        <Flex align="start">
                            <Heading size="md">Edit Level Details</Heading>
                        </Flex>
                        <Box my={4} textAlign="left">
                            <form onSubmit={handleSubmit}>
                                < FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input type="text" placeholder="level name" value={role.name}
                                           onChange={(e) => setName(e.target.value)}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Salary</FormLabel>
                                    <Input type="number" placeholder="enter level salary" value={role.salary}
                                           onChange={(e) => setSalary(e.target.value)}/>
                                </FormControl>
                                <HStack alignItems="end" spacing={5}>
                                    <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>}>
                                        Save
                                    </Button>
                                    <Button type="button" size="md" mt={4} colorScheme="red" leftIcon={<MdDelete/>}
                                            onClick={onOpen}>
                                        Discard
                                    </Button>
                                </HStack>
                            </form>
                        </Box>
                    </Stack>
                </Flex>

            </>
    )
}


function PopUp({isOpen, onClose, id, token, toast}) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        setIsLoading(true);
        const {data: response} = await axios.delete(`${SERVER_URL}/skill/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (!response || typeof response.error == "string") {
            setIsLoading(false);
            toast({
                title: response.error ? response.error : "network error",
                status: "error",
                isClosable: true
            })
            return;
        }
        if (!response.success) {
            setIsLoading(false);
            toast({
                title: response.message ? response.message : "network error",
                status: "error",
                isClosable: true
            })
            return;
        }
        if (response.success) {
            setIsLoading(false);
            return navigate("/admin/dashboard/roles");
        }

    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalCloseButton/>
                    <ModalBody>
                        Are You Sure You Want To Discard Changes?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={(e) => {
                            onClose();
                            handleDelete();
                        }} isLoading={isLoading}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
