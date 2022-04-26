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
            const {data:response} = await axios.delete(`${SERVER_URL}/employee/${prop.id}`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            if(!response || typeof response.error == "string"){
                toast({
                    title:response.error? response.error: "something went wrong",
                    status:"error",
                    isClosable:true
                })
                setIsLoading(false);
                return;
            }
            if(!response.status){
                toast({
                    title:response.message? response.message:"something went wrong",
                    status:"error",
                    isClosable:true
                })
                setIsLoading(false);
                return;
            }
            if(response.success){
                toast({
                    title:response.message,
                    status:"success",
                    isClosable:true
                })
            }

            setIsLoading(false);
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
        return navigate(`/admin/dashboard/employee/${prop.id}`);
    }
    return(
        <>
        <Tr>
            <Td>{prop.firstname}</Td>
            <Td>{prop.lastname}</Td>
            <Td>{prop.dob}</Td>
            <Td>{prop.profession}</Td>
            <Td> 
            <HStack> 
                <Button leftIcon={<BiEdit/>} colorScheme="facebook" onClick={handleEdit}>Edit</Button>
                <Button leftIcon={<MdDelete/>} isLoading={isLoading} colorScheme='red' onClick={handleDelete}>Delete</Button>
            </HStack>
            </Td>
        </Tr>
        </>

    )
}
