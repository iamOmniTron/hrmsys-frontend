import {Spinner,Flex} from "@chakra-ui/react";

export default function Loader(){
    return(
        <>
        <Flex height="80vh" maxWidth="100vw" justifyContent="center" alignItems="center">
            <Spinner thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
                />
        </Flex>
        </>
    )
}