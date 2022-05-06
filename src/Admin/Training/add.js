import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import {useState,useContext} from "react";
import AuthContext from "../../contexts/auth";
import axios from "axios";
import {useNavigate } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AddTraining(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [token] = useContext(AuthContext);
    const [name,setName] = useState("");
    const [duration,setDuration] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e)=>{
        e.preventDefault()
      const {data:response} = await axios.post(`${SERVER_URL}/training`,
      {
          name,duration
      },{
        headers:{
          "Authorization":`Bearer ${token}`,
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
        return navigate("/admin/dashboard/trainingss");
      }
    }
    return(
        <>
             <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Add New Training PROGRAM</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Training Nmae</FormLabel>
              <Input type="text" placeholder="training name" value={name} onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <FormLabel>Training Duration</FormLabel>
              <Input type="number" placeholder="training duration" value={duration} onChange={(e)=>setDuration(e.target.value)}/>
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>}  isLoading={isLoading}>
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
