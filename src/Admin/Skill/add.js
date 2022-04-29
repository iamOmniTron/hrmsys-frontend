import { useNavigate } from "react-router-dom";
import {useState,useContext} from "react";
import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import AuthContext from "../../contexts/auth";
// import AdminContext from "../../contexts/admin";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function AddSkill(){
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [token] = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
    const [name,setName] = useState("");
    // const [isAdmin] = useContext(AdminContext);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        const {data:response} = await axios.post(`${SERVER_URL}/skill/`,{
          name
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
            return navigate("/admin/dashboard/skills");
          }
    }

    return(
        <>
         <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Add New Skill</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" placeholder="Skill name" value={name} onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>} isLoading={isLoading} onClick={handleSubmit}>
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