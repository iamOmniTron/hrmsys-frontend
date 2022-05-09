import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast,InputGroup,InputLeftAddon} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import {useState,useEffect,useContext} from "react";
import AuthContext from "../../contexts/auth";
import Loader from "../../Components/loader";
// import AdminContext from "../../contexts/admin";
import axios from "axios";
import { useParams,useNavigate} from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Employee(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [token] = useContext(AuthContext);
    const [employee,setEmployee] = useState({});
    const [ professions,setProfessions] = useState([]);
    const [isLoading,setIsLoading] = useState(false); 
    const {id} = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData(e.target);
      const {data:response} = await axios.post(`${SERVER_URL}/employee/${id}`,formData,{
        headers:{
          "Authorization":`Bearer ${token}`,
          "content-type":"multipart/formdata"
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
        setIsLoading(false)
       return navigate("/admin/dashboard/employees");
      }

    }



    useEffect(()=>{
      const fetchEmployee = async ()=>{
        const {data:response} = await axios.get(`${SERVER_URL}/employee/${id}`,{
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
          setIsLoading(false)
          setEmployee(response.data);
        }
        return ;
      }
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
      fetchEmployee();
      fetchProfessions();

    },[token,id,toast]);

    return(
      isLoading? <Loader/> :
        <>
        <PopUp isOpen={isOpen} onClose={onClose} id={id} token={token} toast={toast}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Edit Employee Detail</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
          <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                            < FormControl >
                                <FormLabel>Firstname</FormLabel>
                                <Input type="text" placeholder="employee firstname" name="firstname" value={employee.firstname}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Lastname</FormLabel>
                                <Input type="text" placeholder="employee lastname" name="lastname" value={employee.lastname}/>
                            </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'}  mt={6}>
                                        <FormControl>
                                    <FormLabel>Middlename</FormLabel>
                                    <Input type="text" placeholder="middlename" value={employee.middlename} name="middlename"/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>PSM</FormLabel>
                                    <Input type="text" placeholder="employee psm" name="psm" value={employee.psm}/>
                                </FormControl>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6}>
                                <FormControl >
                                    <FormLabel>Date Of Birth</FormLabel>
                                    <Input type="date" size="md" placeholder="date of birth" name="dob" value={employee.dob}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='status'>Marital Status</FormLabel>
                                    <Select id='status' placeholder='select marital status' name="maritalStatus">
                                        <option value="married">Married</option>
                                        <option value="single">Single</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                <FormLabel htmlFor='profession'>Profession</FormLabel>
                                <Select id='status' placeholder='select occupation' name="ProfessionId">
                                    {
                                        professions !== [] && professions.map((prof,idx)=>{
                                            console.log(prof);
                                            return(
                                            <option value={prof.id} key={idx}>{prof.name}</option>
                                            );
                                        })
                                    }
                                </Select>
                                </FormControl>
                            </HStack>
                            <HStack mt={6}>
                            <FormControl >
                                <FormLabel>Email</FormLabel>
                                <Input type="email" placeholder="employee@hrmsys.com" name="email" value={employee.email}/>
                            </FormControl>
                            <FormControl >
                                <FormLabel>Phone</FormLabel>
                                <InputGroup>
                                <InputLeftAddon children="+234"/>
                                <Input type="tel" placeholder="enter employee phone number" value={employee.phone} name="phone"/>
                                </InputGroup>
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
                            </HStack>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" 
            colorScheme="blue" leftIcon={<MdSave/>}>
              Save
            </Button>
            <Button type="button" size="md" mt={4} colorScheme="red" leftIcon={<MdDelete/>} onClick={onOpen}>
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

function PopUp({isOpen,onClose,id,token,toast}) {
  const navigate = useNavigate()
  const [isLoading,setIsLoading] = useState(false);
  const handleDelete = async(e)=>{
    setIsLoading(true);
    const {data:response} = await axios.delete(`${SERVER_URL}/employee/${id}`,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    })
    if(!response || typeof response.error == "string"){
      setIsLoading(false);
        toast({
          title:response.error ? response.error :"network error",
          status:"error",
          isClosable:true
        })
        return;
      }
      if(!response.success){
        setIsLoading(false);
        toast({
          title:response.message ? response.message :"network error",
          status:"error",
          isClosable:true
        })
        return;
      }
      if(response.success){
        setIsLoading(false);
      return navigate("/admin/dashboard/employees");
      }

  }
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                Are You Sure You Want To Discard Changes?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={()=>{
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

