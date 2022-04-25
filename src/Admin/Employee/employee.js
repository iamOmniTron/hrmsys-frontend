import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import {useState,useEffect,useContext} from "react";
import AuthContext from "../../contexts/auth";
import Loader from "../../Components/loader";
import AdminContext from "../../contexts/admin";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Employee(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [token] = useContext(AuthContext);
    const [isAdmin] = useContext(AdminContext);
    const [employee,setEmployee] = useState({});
    const [isLoading,setIsLoading] = useState(false); 
    const navigate = useNavigate();
    const toast = useToast();
    const {id} = useParams();

    const checkIsLoggedIn = (token)=>{
      if(!token || token.length < 1){
        return navigate("/admin/login")
      }
      return;
    }

    const checkIsAdmin = (isAdmin)=>{
        if(!isAdmin){
          return navigate("/admin/login");
        }
        return;
      }


    const fetchEmployee = async ()=>{
      const {data:response} = await axios.get(`${SERVER_URL}/employee/${id}`,{
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
        console.log(response.data);
        setEmployee(response.data);
      }
      return setIsLoading(false);
    }

    useEffect(()=>{
      checkIsLoggedIn(token);
      checkIsAdmin(isAdmin);
    
      fetchEmployee();

    },[token]);

    return(
      isLoading? <Loader/> :
        <>
        <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Edit Employee Detail</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Firstname</FormLabel>
              <Input type="text" placeholder="employee firstname" />
            </FormControl>
            <FormControl>
              <FormLabel>Lastname</FormLabel>
              <Input type="text" placeholder="employee lastname" />
            </FormControl>
            <HStack direction={{ base: 'column', sm: 'row' }}
                align={'start'}>
            <FormControl>
              <FormLabel>Date Of Birth</FormLabel>
              <Input type="date" placeholder="date of birth" />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor='status'>Marital Status</FormLabel>
                <Select id='country' placeholder='select marital status'>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                </Select>
                </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="test@test.com" />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="*******" />
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>}>
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

