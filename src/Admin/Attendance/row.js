import {Tr,Td} from "@chakra-ui/react";

export default function Row({prop}){
    return(
        <>
           <Tr>
            <Td>{prop.email}</Td>
            <Td>{prop.timeIn}</Td>
            <Td>{prop.timeOut}</Td>
        </Tr>
        </>
    )
}