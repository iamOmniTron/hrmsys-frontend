import {useNavigate} from "react-router-dom";
import {Tr,Td,HStack,Button,useToast} from "@chakra-ui/react";
import {BiEdit} from "react-icons/bi";
import {MdDelete} from "react-icons/md";
import {useState,useContext} from "react";
import AuthContext from "../../contexts/auth";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;


export default function Row({prop}){
    const [isLoading,setIsLoading] = useState(false);
    const [token,_] = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    const handleDelete = async(e)=>{
        try{
            setIsLoading(true);
            const {data:response} = await axios.delete(`${SERVER_URL}/skill/${prop.id}`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            if(!response || typeof response.error == "string"){
                setIsLoading(false);
                toast({
                    title:response.error? response.error: "something went wrong",
                    status:"error",
                    isClosable:true
                })
                return;
            }
            if(!response.status){
                
                setIsLoading(false);
                toast({
                    title:response.message? response.message:"something went wrong",
                    status:"error",
                    isClosable:true
                })
                return;
            }
            if(response.success){
            setIsLoading(false);
                toast({
                    title:response.message,
                    status:"success",
                    isClosable:true
                })
            }
            return;


        }catch(err){
            console.log(err);
            toast({
                title:"you have network problems",
                status:"error",
                isClosable:true
            });
        }
    }

    const handleEdit = (e)=>{
        return navigate(`/admin/dashboard/skill/${prop.id}`);
    }
    return(
        <>
        <Tr>
            <Td>{prop.name}</Td>
            <Td> 
            <HStack> 
                <Button leftIcon={<BiEdit/>} size="sm" colorScheme="facebook" onClick={handleEdit}>Edit</Button>
                <Button leftIcon={<MdDelete/>} size="sm" isLoading={isLoading} colorScheme='red' onClick={handleDelete}>Delete</Button>
            </HStack>
            </Td>
        </Tr>
        </>

    )
}
