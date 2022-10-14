import { useEffect } from 'react'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
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
  useToast,
  FormErrorMessage,
  FormHelperText,
  Link
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { usePocketBase } from '../../provider/pb'

const ResetPassword = () => {
  const backend = usePocketBase()
  const toast = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const initialValue = {
    email: '',
    password: ''
  }
  const validationSchema = Yup.object({
    email: Yup.string().email().required()
  })
  useEffect(() => {
    document.title = `Reset Password`
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
        <Heading color="teal.400">Reset Password</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={({ email }) =>
              backend.users
                .requestPasswordReset(email)
                .then(() => navigate(location.state?.from?.pathname || '/'))
                .catch(() => {
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
                    <FormHelperText textAlign="right">
                      <RouterLink to="/login">
                        <Link color="teal.400">Go to login</Link>
                      </RouterLink>
                    </FormHelperText>
                  </FormControl>
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Reset Password
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

export default ResetPassword
