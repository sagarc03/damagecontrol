import {
  Box,
  Flex,
  Spacer,
  Tooltip,
  VStack,
  Link,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { Icon as Iconify } from '@iconify/react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { usePocketBase } from '../../provider/pb'

export default function Layout({ children }: { children: JSX.Element }) {
  const backend = usePocketBase()
  const navigate = useNavigate()
  return (
    <Box>
      <Box h="100vh" bg="teal.500" w="75px" position="fixed">
        <Flex h="full" flexDirection="column">
          <VStack p="3">
            <Tooltip label="home" placement="right">
              <Link as={RouterLink} to="/">
                <Iconify
                  width="48"
                  height="48"
                  icon="fluent-emoji-high-contrast:money-with-wings"
                  color="white"
                />
              </Link>
            </Tooltip>
            <Divider />
            <Tooltip label="project" placement="right">
              <Link as={RouterLink} to="/">
                <Iconify
                  icon="ant-design:project-filled"
                  width="48"
                  height="48"
                  color="white"
                />
              </Link>
            </Tooltip>
            <Tooltip label="report" placement="right">
              <Link as={RouterLink} to="/report">
                <Iconify
                  icon="mdi:report-areaspline"
                  width="48"
                  height="48"
                  color="white"
                />
              </Link>
            </Tooltip>
          </VStack>
          <Spacer />
          <Box p="3" mb="2">
            <Menu>
              <MenuButton>
                <Avatar />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    navigate('/profile')
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    backend.authStore.clear()
                    navigate('/')
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
      <Box ml="20">{children}</Box>
    </Box>
  )
}
