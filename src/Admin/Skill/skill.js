import { useState,useContext,useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom";
import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import AuthContext from "../../contexts/auth"
import Loader from "../../Components/loader";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Skill(){
    const [token,_] = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name,setName] = useState("");
    const [skill,setSkill] = useState({});
    const [isLoading,setIsLoading] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        const {data:response} = await axios.post(`${SERVER_URL}/skill/${id}`,{
            name
        },{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
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
            setIsLoading(false)
            return navigate("/admin/dashboard/skills");
          }
    }

    useEffect(()=>{
        const fetchSkill = async ()=>{
            setIsLoading(true);
            const {data:response} = await axios.get(`${SERVER_URL}/skill/${id}`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
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
                setIsLoading(false)
                setSkill(...response.data);
              }
              return;
        }
        fetchSkill();
    },[token,id])
    
    return (
        isLoading ? <Loader/> :
        <>
         <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Edit Role Details</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" placeholder="skill name" value={skill.name} onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>} onClick={handleSubmit}>
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
