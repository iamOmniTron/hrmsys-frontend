import {Tr,Td,Button,useToast} from "@chakra-ui/react";
import {MdPayments} from "react-icons/md";
import {useState,useContext} from "react";
import AuthContext from "../../contexts/auth";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Row({prop}){
    const [token,_] = useContext(AuthContext);
    const [isLoading,setIsLoading] = useState(false);
    const [isPaid,setIsPaid] = useState(prop.paid);
    const toast = useToast();

     const STATUSES = {
        "1":"Active",
        "2":"On Training",
        "3":"On Leave",
        "4":"Retired"
    }

    const MONTHS = {
        "1":"January",
        "2":"February",
        "3":"March",
        "4":"April",
        "5":"May",
        "6":"June",
        "7":"July",
        "8":"August",
        "9":"September",
        "10":"October",
        "11":"November",
        "12":"December"
    }

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
             <Td>{prop.id}</Td>
             <Td>{prop.User.firstname}</Td>
            <Td>{prop.User.email}</Td>
            <Td>{prop.User?.Profession?.name}</Td>
            <Td>{STATUSES[prop.User.status?.toString()]}</Td>
            <Td>{new Intl.NumberFormat("en-US",{style:"currency", currency: 'NGN'}).format(prop.User?.Profession?.salary)}</Td>
            <Td>{MONTHS[prop.month.toString()]}</Td>
            <Td>{prop.paid === true? "Paid" : "Not Paid"}</Td>
            <Td>  
            <Button leftIcon={<MdPayments/>} disabled={isPaid} colorScheme="facebook" isLoading={isLoading} onClick={handlePayment}>Pay</Button>
            </Td>
        </Tr>
        </>
    )
}