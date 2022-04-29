import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import {useState,useContext} from "react";
import AuthContext from "../../contexts/auth";
// import AdminContext from "../../contexts/admin";
import axios from "axios";
import {useNavigate } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AddEmployee(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [token] = useContext(AuthContext);
    // const [isAdmin] = useContext(AdminContext);
    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [email,setEmail] = useState("");
    const [dob,setDob] = useState("");
    const [password,setPassword] = useState("");
    const [maritalStatus,setMaritalStatus] = useState("");
    const [isLoading,setIsLoading] = useState(false); 
    const navigate = useNavigate();
    const toast = useToast();

    // const checkIsLoggedIn = (token)=>{
    //   if(!token || token.length < 1){
    //     return navigate("/admin/login")
    //   }
    //   return;
    // }

    // const checkIsAdmin = (isAdmin)=>{
    //     if(!isAdmin){
    //       return navigate("/admin/login");
    //     }
    //     return;
    //   }


    const handleSubmit = async (e)=>{
        e.preventDefault()
      const {data:response} = await axios.post(`${SERVER_URL}/employee`,{
          firstname,
          lastname,
          email,
          dob,
          password,
          maritalStatus
      },{
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
        setIsLoading(false);
        return navigate("/admin/dashboard/employees");
      }
    }

    // useEffect(()=>{
    //   checkIsLoggedIn(token);
    //   checkIsAdmin(isAdmin);
    // },[token]);

    return(
        <>
        <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Add New Employee</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Firstname</FormLabel>
              <Input type="text" placeholder="employee firstname" value={firstname} onChange={(e)=>setFirstname(e.target.value)}/>
            </FormControl>
            <FormControl>
              <FormLabel>Lastname</FormLabel>
              <Input type="text" placeholder="employee lastname" value={lastname} onChange={(e)=>setLastname(e.target.value)}/>
            </FormControl>
            <HStack direction={{ base: 'column', sm: 'row' }}
                align={'start'}>
            <FormControl>
              <FormLabel>Date Of Birth</FormLabel>
              <Input type="date" placeholder="date of birth" value={dob} onChange={(e)=>setDob(e.target.value)}/>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor='status'>Marital Status</FormLabel>
                <Select id='country' placeholder='select marital status' value={maritalStatus} onChange={(e)=>setMaritalStatus(e.target.value)}>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                </Select>
                </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="employee@hrmsys.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="*******" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>} onClick={handleSubmit} isLoading={isLoading}>
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

function PopUp({isOpen,onClose}) {
  
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
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
