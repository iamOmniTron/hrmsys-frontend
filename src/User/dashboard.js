import {Link as ReachLink,Outlet,useNavigate} from "react-router-dom";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import {FaHandshake} from "react-icons/fa";
import {ImUsers} from "react-icons/im";
import {BsTools} from "react-icons/bs";
import {MdPayments} from "react-icons/md";
import {VscSignIn} from "react-icons/vsc";
import {GiSkills} from "react-icons/gi";
import {AiOutlineDashboard} from "react-icons/ai";
import AuthContext from "../contexts/auth";
import {useEffect,useContext} from "react";

const LinkItems = [
  { name : "Dashboard", icon:AiOutlineDashboard,link:"profile"},
  { name: 'Employees', icon: ImUsers,link:"attendance" },
  { name:"Levels", icon: BsTools, link:"training programs"},
];

export default function UserDashboard({children}){
    const [token,_] = useContext(AuthContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();


    useEffect(()=>{
        const check = ()=>{
            if(!token || token.length < 1){
              return navigate("/login");
            }
            return;
          }
          check();
    },[token])
    return(
    <>
         <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} setIsAdmin={setIsAdmin} setToken={setToken}/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet/>
      </Box>
    </Box>
    </>
    )
}

const SidebarContent = ({ onClose, ...rest }) => {
    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Employee
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link,index) => (
          <NavItem key={index} icon={link.icon} link={link.link}>
            <Text>{link.name}</Text>
          </NavItem>
        ))}
      </Box>
    );
}
const NavItem = ({ icon,link, children, ...rest }) => {
    return (
      <Link to={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} as={ReachLink}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    );
  };

const MobileNav = ({ onOpen,setToken,setIsAdmin}) => {
    // const handleLogout = (e)=>{
    //   setToken("");
    //   setIsAdmin("");
    // }
    return (
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
          >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
  
        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold">
          System Admin
        </Text>
  
        <HStack spacing={{ base: '0', md: '6' }}>
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          />
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2">
                    <Text fontSize="sm">Adminitrator</Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <MenuDivider />
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    );
  };