import {useState, useEffect, useContext} from "react";
import axios from "axios";
import AuthContext from "../contexts/auth";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue, useToast, Text, HStack, VStack
} from "@chakra-ui/react";
import Loader from "../Components/loader";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Profile() {
    const [token, _] = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const STATUSES = {
        "1": "Active",
        "2": "On Training",
        "3": "On Leave",
        "4": "Retired"
    }

    useEffect(() => {
        console.log('jhgrr')
        const getUser = async () => {
            const {data: response} = await axios.get(`${SERVER_URL}/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (!response || typeof response.error == "string") {
                toast({
                    title: response.error ? response.error : "network error",
                    status: "error",
                    isClosable: true
                })
                return setIsLoading(false);
            }
            if (!response.success) {
                toast({
                    title: response.message ? response.message : "network error",
                    status: "error",
                    isClosable: true
                })
                return setIsLoading(false);
            }
            if (response.success) {
                setIsLoading(false);
                setUser(response.data);
                console.log(response.data)
            }

        }
        getUser()
    }, [token]);
    return (
        <>
            <Flex
                minH={'100vh'}
                align={'flex-start'}
                justify={'space-between'}
                flexDirection={'row'}
                bg={useColorModeValue('gray.50', 'gray.800')} width={'100%'}>
                <Stack spacing={8} maxW={'lg'} py={12} px={6} width={'100%'}>
                    <Stack align={'flex-start'}>
                        <Heading fontSize={'4xl'}>Profile</Heading>
                    </Stack>
                    <Box
                        p={8} width={'100%'} fontSize={'18'}>
                        <Stack spacing={10} width={'100%'}>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6} spacing={20} width={'100%'}>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>Firstname</Text>
                                    <Text fontWeight={'semibold'}>{user.firstname}</Text>
                                </VStack>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>Lastname</Text>
                                    <Text fontWeight={'semibold'}>{user.lastname}</Text>
                                </VStack>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>Middlename</Text>
                                    <Text fontWeight={'semibold'}>{user.middlename}</Text>
                                </VStack>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6} spacing={20} width={'100%'}>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>E-mail</Text>
                                    <Text fontWeight={'semibold'}>{user.email}</Text>
                                </VStack>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>Phone</Text>
                                    <Text fontWeight={'semibold'}>{user.phone}</Text>
                                </VStack>
                                <VStack align={'start'} width={'30%'}>
                                    <Text>Gender</Text>
                                    <Text fontWeight={'semibold'}>{user.gender}</Text>
                                </VStack>
                            </HStack>
                            <HStack direction={{base: 'column', sm: 'row'}}
                                    align={'start'} mt={6} spacing={20}>
                                <VStack align={'start'}>
                                    <Text>Level</Text>
                                    <Text fontWeight={'semibold'}>{user.Profession?.name}</Text>
                                </VStack>
                                <VStack align={'start'}>
                                    <Text>Salary</Text>
                                    <Text fontWeight={'semibold'}>{user.Profession?.name}</Text>
                                </VStack>
                                <VStack align={'start'}>
                                    <Text>Status</Text>
                                    <Text fontWeight={'semibold'}>{STATUSES[user.status?.toString()]}</Text>
                                </VStack>
                            </HStack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}