import {Tr,Td,Button,useToast} from "@chakra-ui/react";
import {MdPayments} from "react-icons/md";
import {useState,useContext} from "react";
import AuthContext from "../../contexts/auth";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Row({prop}){
    const [token,_] = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
    const toast = useToast();
    const handlePayment = async (e)=>{
        setIsLoading(true);
        const {data:response} = await axios.post(`${SERVER_URL}/pay/employee`,{userId:prop.id},{
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
    }


    return (
        <>
         <Tr>
            <Td>{prop.email}</Td>
            <Td>{prop.profession.name}</Td>
            <Td>{prop.profession.salary.amount}</Td>
            <Td>Status</Td>
            <Td>
            <Button leftIcon={<MdPayments/>} colorScheme="facebook" isLoading={isLoading} onClick={handlePayment}>Pay</Button>
            </Td>
        </Tr>
        </>
    )
}