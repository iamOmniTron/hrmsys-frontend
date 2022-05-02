import {Tr,Td} from "@chakra-ui/react";

export default function Row({prop}){
    return (
        <>
          <Tr>
            <Td>{new Date(prop.timeIn).getDay()}</Td>
            <Td>{prop.timeIn}</Td>
            <Td>{prop.timeOut}</Td>
        </Tr>
        </>
    )
}