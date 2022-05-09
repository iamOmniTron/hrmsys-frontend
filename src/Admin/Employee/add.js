import {
    Flex, Box, FormLabel, FormControl, Input, Button, Heading, HStack, Select, Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, useToast,useColorModeValue
} from "@chakra-ui/react";
import {MdDelete, MdSave} from "react-icons/md";
import {useState, useEffect,useContext} from "react";
import AuthContext from "../../contexts/auth";
// import AdminContext from "../../contexts/admin";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AddEmployee() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [token] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [professions,setProfessions] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();


    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const {data: response} = await axios.post(`${SERVER_URL}/employee`,
            formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "content-type": "multipart/formdata"
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
            setIsLoading(false);
            return navigate("/admin/dashboard/employees");
        }
    }

    useEffect(()=>{
        const fetchProfessions = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/professions/all`,{
                headers:{
                    "Authorization":`Bearee ${token}`
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
                setIsLoading(false);
                setProfessions(response.data);
            }
        }
        fetchProfessions();
    },[token]);

    return (
        <>
            <PopUp isOpen={isOpen} onClose={onClose}/>
            <Flex direction="column" minHeight="100vh">
                <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6} boxShadow={'2xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}>
                    <Flex align="start">
                        <Heading size="md">Add New Employee</Heading>
                    </Flex>
                    <Box my={4} textAlign="left">
                        <form onSubmit={handleSubmit}>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                            < FormControl >
                                <FormLabel>Firstname</FormLabel>
                                <Input type="text" placeholder="employee firstname" name="firstname"/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Lastname</FormLabel>
                                <Input type="text" placeholder="employee lastname" name="lastname"/>
                            </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'}  mt={6}>
                                        <FormControl>
                                    <FormLabel>Middlename</FormLabel>
                                    <Input type="text" placeholder="middlename" name="middlename"/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>PSM</FormLabel>
                                    <Input type="text" placeholder="employee psm" name="psm"/>
                                </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                                <FormControl >
                                    <FormLabel>Date Of Birth</FormLabel>
                                    <Input type="date" placeholder="date of birth" name="dob"/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='status'>Marital Status</FormLabel>
                                    <Select id='status' placeholder='select marital status' name="maritalStatus">
                                        <option value="married">Married</option>
                                        <option value="single">Single</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                <FormLabel htmlFor='proffession'>Profession</FormLabel>
                                <Select id='status' placeholder='select occupation' name="ProfessionId">
                                    {
                                        professions !== [] && professions.map((prof,idx)=>{
                                            <option value={prof.id} key={idx}>prof.name</option>
                                        })
                                    }
                                </Select>
                                </FormControl>
                            </HStack>
                            <HStack mt={6}>
                            <FormControl >
                                <FormLabel>Email</FormLabel>
                                <Input type="email" placeholder="employee@hrmsys.com" name="email"/>
                            </FormControl>
                            <FormControl >
                                <FormLabel>Phone</FormLabel>
                                <Input type="telephone" placeholder="enter employee phone number" name="phone"/>
                            </FormControl>
                            <FormControl >
                            <FormLabel htmlFor='status'>Gender</FormLabel>
                            <Select id='gender' placeholder='select gender' name="gender">
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                            </Select>
                            </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                                <FormControl >
                                <FormLabel>Date of Appointment</FormLabel>
                                <Input type="date" placeholder="enter date of appointment" name="doa"/>
                            </FormControl>
                            <FormControl >
                                <FormLabel>Date of Retirement</FormLabel>
                                <Input type="date" placeholder="enter date of retirement" name="dor"/>
                            </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" placeholder="*******" name="password"/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Image</FormLabel>
                                <Input type="file" placeholder="upload image" name="picture"/>
                            </FormControl>
                            </HStack>
                            <HStack>

                            </HStack>
                            <HStack alignItems="end" spacing={5}>
                                <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>}
                                        isLoading={isLoading}>
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

function PopUp({isOpen, onClose}) {

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
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

