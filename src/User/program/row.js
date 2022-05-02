import {Tr,Td} from "@chakra-ui/react";

export default function Row({prop}){
    return (
        <>
          <Tr>
            <Td>{prop.name}</Td>
            <Td>{prop.skill.name}</Td>
        </Tr>
        </>
    )
}