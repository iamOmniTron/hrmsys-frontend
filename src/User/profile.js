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
    useColorModeValue, useToast, Text, HStack, VStack, Img
} from "@chakra-ui/react";
import Loader from "../Components/loader";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Profile() {
    const [token, _] = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const STATUSES = {
        "1": "Active",
        "2": "On Training",
        "3": "On Leave",
        "4": "Retired"
    }

    useEffect(() => {
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
                setUser(response.data.user);
                let url = response.data.urls[0]
                const name = url.substring(0, url.indexOf('-'))
                const imageUrl = `${SERVER_URL}/uploads/${name}/${url}`
                setImage(imageUrl)
                console.log(response.data)
            }

        }
        getUser()
    }, [token]);
    return (
        <>
            <Flex flexDirection={'column'} minW={'100%'} bg={useColorModeValue('gray.50', 'gray.800')} width={'100%'}>
                <Stack align={'flex-start'} px={8} py={4}>
                    <Heading fontSize={'4xl'}>Profile</Heading>
                </Stack>
                <Flex
                    minH={'100vh'}
                    align={'flex-start'}
                    justify={'space-between'}
                    flexDirection={'row'}
                    minW={'100%'}
                    borderTop={'2px'}>
                    <Stack spacing={8} maxW={'lg'} py={12} px={6} width={'100%'}>
                        <Stack align={'flex-start'}>
                            <Heading fontSize={'4xl'}></Heading>
                        </Stack>
                        <Flex
                            align={'flex-start'}
                            justify={'space-between'}
                            flexDirection={'row'} minW={'100%'}>
                            <Box
                                p={8} fontSize={'18'}>
                                <Stack spacing={10} >
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
                                            <Text fontWeight={'semibold'}>N{user.Profession?.salary}</Text>
                                        </VStack>
                                        <VStack align={'start'}>
                                            <Text>Status</Text>
                                            <Text fontWeight={'semibold'}>{STATUSES[user.status?.toString()]}</Text>
                                        </VStack>
                                    </HStack>
                                    <HStack direction={{base: 'column', sm: 'row'}}
                                            align={'start'} mt={6} spacing={20}>
                                            <VStack align={'start'} width={'30%'}>
                                          <Text>Last Promoted On </Text>
                                      <Text fontWeight={'semibold'}>{user.lastPromotionDate}</Text>
                                      </VStack>
                                      <VStack align={'start'} width={'30%'}>
                                      <Text>Country</Text>
                                      <Text fontWeight={'semibold'}>{user.country}</Text>
                                      </VStack>
                                    </HStack>
                                    <HStack direction={{base: 'column', sm: 'row'}>
                                      <VStack align={'start'} width={'30%'}>
                                        <Text> State</Text>
                                        <Text fontWeight={'semibold'}>{user.state}</Text>
                                      <VStack>
                                      <VStack align={'start'} width={'30%'}>
                                        <Text> Home Town</Text>
                                        <Text fontWeight={'semibold'}>{user.hometown}</Text>
                                      <VStack>
                                    </HStack>
                                    <HStack direction={{base: 'column', sm: 'row'}>
                                      <VStack align={'center'} width={'30%'}>
                                        <Text>Address</Text>
                                        <Text fontWeight={'semibold'}>{user.contactAddress}</Text>
                                      <VStack>
                                    </HStack>
                                </Stack>
                            </Box>
                        </Flex>
                    </Stack>
                    <Stack spacing={8} maxW={'lg'} py={12} px={6} width={'100%'}>
                        <Stack align={'flex-start'}>
                            <Heading fontSize={'4xl'}> </Heading>
                        </Stack>
                        <Flex
                            align={'flex-start'}
                            justify={'space-between'}
                            flexDirection={'row'} minW={'100%'}>
                            <Box
                                p={8} fontSize={'18'}>
                                <Img  mt={8} src={image} width={'280px'} height={'280px'} rounded={'xl'}></Img>
                            </Box>
                        </Flex>
                    </Stack>
                </Flex>
            </Flex>
        </>
    )
}
