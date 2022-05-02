import {Flex,Box,FormLabel,FormControl,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure,useToast} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";
import {useState,useEffect, useContext} from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
import AuthContext from "../../../contexts/auth";

export default function AddProgram(){
    const [skills,setSkills] = useState([]);
    const [trainings,setTrainings]= useState([]);
    const [token,_] = useContext(AuthContext);
    const [skill,setSkill] = useState("");
    const [training,setTraining] = useState("");
    const [isLoading,setIsLoading]= useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async()=>{
        const fetchSkills = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/program`,{
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
                return navigate("/user/dashboard/programs")
              }
        }
    }

    useEffect(()=>{
        const fetchSkills = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/skills/all`,{
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
                setSkills([...response.data]);
              }
              return;
        }

        const fetchTrainings = async()=>{
            const {data:response} = await axios.get(`${SERVER_URL}/trainings/all`,{
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
                setTrainings([...response.data]);
              }
              return;
        }

        fetchTrainings();
        fetchSkills();
    },[token]);


    return (
        <>
                 <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Join A Program</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
               <FormControl>
                <FormLabel htmlFor='training'>Training</FormLabel>
                <Select id='training' placeholder='select training' name="training" value={training} onChange={(e)=>setTraining(e.target.value)}>
                   {
                       trainings && trainings.map((t,index)=>{
                        <option key={index} value={t.id}>{t.name}</option>
                       })
                   }
                </Select>
                </FormControl>
                <FormControl>
                <FormLabel htmlFor='skill'>Skill</FormLabel>
                <Select id='skill' placeholder='select skill' name="skill" value={skill} onChange={(e)=>setSkill(e.target.value)}>
                   {
                       skills && skills.map((s,index)=>{
                        <option key={index} value={s.id}>{s.name}</option>
                       })
                   }
                </Select>
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
