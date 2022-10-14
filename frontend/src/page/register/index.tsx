import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  useToast,
  FormErrorMessage,
  Link
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { usePocketBase } from '../../provider/pb'
import { ClientResponseError } from 'pocketbase'

const Register = () => {
  const backend = usePocketBase()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const handleShowClick = () => setShowPassword(!showPassword)

  const initialValue = {
    email: '',
    password: '',
    passwordConfirm: ''
  }
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().max(100).min(8).required(),
    passwordConfirm: Yup.string()
      .max(100)
      .min(8)
      .oneOf([Yup.ref('password'), null], 'password must match')
      .required('password is a required field')
  })
  useEffect(() => {
    document.title = `Register`
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
        <Heading color="teal.400">Register</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={({ email, password, passwordConfirm }, { resetForm }) =>
              backend.users
                .create({ email, password, passwordConfirm })
                .then((userData) => {
                  toast({
                    title: 'Account created',
                    description: `User with email '${userData.email}' created.`,
                    status: 'success',
                    isClosable: true
                  })
                  resetForm()
                })
                .catch((err: ClientResponseError) => {
                  if (err.status == 400) {
                    toast({
                      title: 'Invalid credentials',
                      description: err.data.data.email.message,
                      status: 'error',
                      isClosable: true
                    })
                    resetForm()
                    return
                  }
                  toast({
                    title: 'Something went wrong',
                    description: err.data.message,
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
                        placeholder="Email address"
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
                  </FormControl>
                  <FormControl
                    isInvalid={
                      formik.touched.passwordConfirm &&
                      !!formik.errors.passwordConfirm
                    }
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        <Icon icon="bxs:lock-alt" color="gray" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        value={formik.values.passwordConfirm}
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
                      {formik.errors.passwordConfirm}
                    </FormErrorMessage>
                    <FormHelperText textAlign="right">
                      <Link as={RouterLink} to="/login" color="teal.400">
                        Go to login?
                      </Link>
                    </FormHelperText>
                  </FormControl>
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register
