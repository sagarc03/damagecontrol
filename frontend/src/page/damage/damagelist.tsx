import {
  Box,
  Center,
  Text,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  InputGroup,
  Input,
  FormControl,
  FormErrorMessage,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react'
import { usePocketBase } from '../../provider/pb'
import { ClientResponseError, Record } from 'pocketbase'
import { Formik } from 'formik'

import * as Yup from 'yup'
import { useEffect, useState } from 'react'

function ProjectPage({ project }: { project: Record }) {
  const backend = usePocketBase()
  const toast = useToast()

  const [damageList, setDamageList] = useState<Record[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialValue = {
    name: '',
    damage: 0,
    tags: '',
    files: []
  }
  const validationSchema = Yup.object({
    name: Yup.string().required().min(10).max(100),
    damage: Yup.number().required().min(0).max(1000000),
    tags: Yup.string(),
    files: Yup.mixed()
  })

  const getDamageForProject = () => {
    if (!project) {
      return
    }

    backend.records
      .getList('expense', 1, 500, {
        filter: `project.id = "${project.id}"`
      })
      .then((data) => {
        setDamageList(data.items)
      })
      .catch((err: ClientResponseError) => {
        console.log(err.data)
        console.log(project)
        if (err.status >= 400) {
          toast({
            title: 'something went wrong',
            status: 'error',
            isClosable: true
          })
        }
      })
  }

  useEffect(() => getDamageForProject(), [project])

  return (
    <Box p="3">
      <Flex>
        <Text fontSize="4xl" color="gray">
          Project / {project.name}
        </Text>
        <Spacer />
        <Button
          borderRadius={0}
          variant="solid"
          colorScheme="teal"
          onClick={onOpen}
        >
          Add Damage
        </Button>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Create New Project!</DrawerHeader>
              <DrawerBody>
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={({ name, damage }, { resetForm }) =>
                    backend.records
                      .create('expense', {
                        name,
                        cost: damage,
                        project: project.id
                      })
                      .then(() => {
                        toast({
                          title: `Expense of ${damage} added to ${project.name}`,
                          status: 'success',
                          isClosable: true
                        })
                        resetForm()
                        onClose()
                        getDamageForProject()
                      })
                      .catch((err: ClientResponseError) => {
                        if (err.status >= 400) {
                          toast({
                            title: 'Something went wrong',
                            description: 'please try again after sometime',
                            status: 'error',
                            isClosable: true
                          })
                          console.log(err.data)
                        }
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
                          isInvalid={
                            formik.touched.name && !!formik.errors.name
                          }
                        >
                          <InputGroup>
                            <Input
                              id="name"
                              type="name"
                              placeholder="Project name"
                              name="name"
                              value={formik.values.name}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {formik.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            formik.touched.damage && !!formik.errors.damage
                          }
                        >
                          <InputGroup>
                            <Input
                              id="damage"
                              type="number"
                              placeholder="Damage"
                              name="damage"
                              value={formik.values.damage}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {formik.errors.damage}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            formik.touched.tags && !!formik.errors.tags
                          }
                        >
                          <InputGroup>
                            <Input
                              id="tags"
                              type="text"
                              placeholder="tags"
                              name="tags"
                              value={formik.values.tags}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {formik.errors.tags}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            formik.touched.files && !!formik.errors.files
                          }
                        >
                          <InputGroup>
                            <Input
                              id="file"
                              type="file"
                              multiple
                              placeholder="file"
                              name="files"
                              value={formik.values.files}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {formik.errors.files}
                          </FormErrorMessage>
                        </FormControl>

                        <Button
                          borderRadius={0}
                          type="submit"
                          variant="solid"
                          colorScheme="teal"
                          width="full"
                        >
                          Add Damage
                        </Button>
                      </Stack>
                    </form>
                  )}
                </Formik>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  borderRadius={0}
                  variant="solid"
                  colorScheme="red"
                  onClick={onClose}
                  width="full"
                >
                  Close
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th isNumeric>Expense</Th>
              <Th>Tags</Th>
              <Th>File</Th>
              <Th>Created on</Th>
            </Tr>
          </Thead>
          <Tbody>
            {damageList.map((value) => (
              <Tr key={value.id}>
                <Td>{value.name}</Td>
                <Td isNumeric>{value.cost}</Td>
                <Td></Td>
                <Td></Td>
                <Td>{value.created}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}
export default function DamageList({ project }: { project: Record | null }) {
  return (
    <Box>
      {project ? (
        <ProjectPage project={project} />
      ) : (
        <Center h="100vh">
          <Text>Select a project to begin</Text>
        </Center>
      )}
    </Box>
  )
}
