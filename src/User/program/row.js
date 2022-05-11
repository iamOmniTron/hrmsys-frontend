import {Tr, Td, Button, useToast} from "@chakra-ui/react";
import {BiEdit} from "react-icons/bi";
import axios from "axios";
import {useContext, useState} from "react";
import AuthContext from "../../contexts/auth";
import {useNavigate} from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Row({prop}){

    const [isLoading,setIsLoading] = useState(false);
    const [token, _] = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();

    const handleJoin = async(e)=>{
        setIsLoading(true);
        axios.post(`${SERVER_URL}/employee/training/${prop.id}`, {}, {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }).then(res => {
            let response = res.data

            if(response.success){
                toast({
                    title:response.message,
                    status:"success",
                    isClosable:true
                })

                setIsLoading(false);
                navigate("/user/dashboard/profile");
                return;
            }

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

        }).catch(err => {
            console.log(err)
            toast({
                title: 'An error has occurred',
                status:"error",
                isClosable:true
            })
        }).finally(() => setIsLoading(false))
    }

    return (
        <>
          <Tr>
            <Td>{prop.name}</Td>
            <Td>{prop.duration}</Td>
            <Td>
                <Button leftIcon={<BiEdit/>} colorScheme="facebook" onClick={handleJoin} isLoading={isLoading} >Join</Button>
            </Td>
        </Tr>
        </>
    )
}