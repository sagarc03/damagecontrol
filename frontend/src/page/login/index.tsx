import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Flex,
  Stack,
  Avatar,
  Heading,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormHelperText,
  Text,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { usePocketBase } from '../../provider/pb'
import { ClientResponseError } from 'pocketbase'

const Login = () => {
  const backend = usePocketBase()
  const toast = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const handleShowClick = () => setShowPassword(!showPassword)

  const initialValue = {
    email: '',
    password: ''
  }
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  })
  useEffect(() => {
    document.title = `Login`
  })

  return (
    <Flex
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        mb="2"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={({ email, password }, { resetForm }) =>
              backend.users
                .authViaEmail(email, password)
                .then(() => navigate(location.state?.from?.pathname || '/'))
                .catch((err: ClientResponseError) => {
                  if (err.status == 400) {
                    toast({
                      title: 'Invalid credentials',
                      description:
                        'user matching the email and password not found',
                      status: 'error',
                      isClosable: true
                    })
                    resetForm()
                  }
                  toast({
                    title: 'Something went wrong',
                    description: 'please try again after sometime',
                    status: 'error',
                    isClosable: true
                  })
                })
            }
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Stack
                  spacing={4}
                  p="1rem"
                  backgroundColor="whiteAlpha.900"
                  boxShadow="md"
                >
                  <FormControl
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon icon="bxs:user" color="gray" />
                      </InputLeftElement>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email address"
                        name="email"
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </InputGroup>
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      formik.touched.password && !!formik.errors.password
                    }
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        <Icon icon="bxs:lock-alt" color="gray" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                    <FormHelperText textAlign="right">
                      <Text fontSize="sm">Reset password?</Text>
                    </FormHelperText>
                  </FormControl>
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Login
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Stack>
      <Box>New to us? Sign up</Box>
    </Flex>
  )
}

export default Login
