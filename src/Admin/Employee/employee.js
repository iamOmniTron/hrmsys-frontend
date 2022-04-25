import {Flex,Box,FormLabel,FormControl,Input,Button,Heading,HStack,Select,Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,useDisclosure} from "@chakra-ui/react";
import {MdDelete,MdSave} from "react-icons/md";

export default function Employee(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <>
        <PopUp isOpen={isOpen} onClose={onClose}/>
        <Flex direction="column"  minHeight="100vh">
        <Stack spacing={10} mx={'2em'} minW={'lg'} py={12} px={6}>
        <Flex align="start">
          <Heading size="md">Edit Employee Detail</Heading>
        </Flex>
        <Box my={4} textAlign="left">
          <form>
          < FormControl>
              <FormLabel>Firstname</FormLabel>
              <Input type="text" placeholder="employee firstname" />
            </FormControl>
            <FormControl>
              <FormLabel>Lastname</FormLabel>
              <Input type="text" placeholder="employee lastname" />
            </FormControl>
            <HStack direction={{ base: 'column', sm: 'row' }}
                align={'start'}>
            <FormControl>
              <FormLabel>Date Of Birth</FormLabel>
              <Input type="date" placeholder="date of birth" />
            </FormControl>
            <FormControl>
                <FormLabel htmlFor='status'>Marital Status</FormLabel>
                <Select id='country' placeholder='select marital status'>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                </Select>
                </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="test@test.com" />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="*******" />
            </FormControl>
            <HStack alignItems="end" spacing={5}>
            <Button size="md" mt={4} type="submit" colorScheme="blue" leftIcon={<MdSave/>}>
              Save
            </Button>
            <Button type="button" size="md" mt={4} colorScheme="red" leftIcon={<MdDelete/>} onClick={onOpen}>
              Discard
            </Button>
            </HStack>
          </form>
        </Box>
      </Stack>
    </Flex>
        </>
    )
}

function PopUp({isOpen,onClose}) {
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                Are You Sure You Want To Discard Changes?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

