import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  Spacer,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react'
import { Icon as Iconify } from '@iconify/react'

import { Formik } from 'formik'
import { ClientResponseError, Record } from 'pocketbase'
import { usePocketBase } from '../../provider/pb'

import { useEffect, useState } from 'react'
import * as Yup from 'yup'

function CreateProject({ getProject }: { getProject: () => void }) {
  const backend = usePocketBase()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialValue = { name: '' }
  const validationSchema = Yup.object({
    name: Yup.string().required().min(10).max(100)
  })

  return (
    <Box>
      <Button
        borderRadius={0}
        variant="solid"
        colorScheme="teal"
        onClick={onOpen}
      >
        Add Project
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
                onSubmit={({ name }, { resetForm }) =>
                  backend.records
                    .create('projects', {
                      name,
                      // @ts-expect-error: User model is present
                      user: backend.authStore.model?.profile.id,
                      archived: 0
                    })
                    .then(() => {
                      toast({
                        title: `project with name '${name}' created`,
                        status: 'success',
                        isClosable: true
                      })
                      resetForm()
                      onClose()
                      getProject()
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
                        isInvalid={formik.touched.name && !!formik.errors.name}
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
                      <Button
                        borderRadius={0}
                        type="submit"
                        variant="solid"
                        colorScheme="teal"
                        width="full"
                      >
                        Create Project
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
    </Box>
  )
}

export default function ProjectMenu({
  setProject
}: {
  setProject: (project: Record | null) => void
}) {
  const backend = usePocketBase()
  const toast = useToast()

  const [projectList, setProjectList] = useState<Record[]>([])
  const [isArchivedOpen, setIsArchivedOpen] = useState<boolean>(false)

  const getProject = () => {
    if (!backend.authStore.model) {
      return
    }
    backend.records
      .getList('projects', 1, 500, {
        // @ts-expect-error: model field is user model
        filter: `user.id = "${backend.authStore.model?.profile?.id}"`
      })
      .then((data) => {
        setProjectList(data.items)
      })
      .catch((err: ClientResponseError) => {
        if (err.status >= 400) {
          toast({
            title: 'something went wrong',
            status: 'error',
            isClosable: true
          })
        }
      })
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <Box h="100vh" w="250px" position="fixed">
      <VStack p="3">
        <CreateProject getProject={getProject} />
        <Divider />
        <VStack>
          {projectList
            .filter((value) => !value.archived)
            .map((value) => (
              <Flex key={value.id} w="full">
                <Button onClick={() => setProject(value)}>{value.name}</Button>
                <Spacer />
                <Tooltip label="archive">
                  <IconButton
                    aria-label="archive"
                    icon={
                      <Iconify icon="bxs:archive-in" width="20" height="20" />
                    }
                    onClick={() => {
                      backend.records
                        .update('projects', value.id, {
                          archived: true
                        })
                        .then(() => getProject())
                        .catch((err: ClientResponseError) => {
                          if (err.status >= 400) {
                            toast({
                              title: 'something went wrong',
                              status: 'error',
                              isClosable: true
                            })
                          }
                        })
                    }}
                  />
                </Tooltip>
              </Flex>
            ))}
        </VStack>
        <Button
          onClick={() => setIsArchivedOpen((isArchivedOpen) => !isArchivedOpen)}
          w="full"
        >
          Show Archived
        </Button>
        <Collapse in={isArchivedOpen} animateOpacity>
          <VStack>
            {projectList
              .filter((value) => value.archived)
              .map((value) => (
                <Flex key={value.id} w="full">
                  <Button onClick={() => setProject(value)}>
                    {value.name}
                  </Button>
                  <Spacer />
                  <Tooltip label="unarchive">
                    <IconButton
                      aria-label="unarchive"
                      icon={
                        <Iconify
                          icon="bxs:archive-out"
                          width="20"
                          height="20"
                        />
                      }
                      onClick={() => {
                        backend.records
                          .update('projects', value.id, {
                            archived: false
                          })
                          .then(() => getProject())
                          .catch((err: ClientResponseError) => {
                            if (err.status >= 400) {
                              toast({
                                title: 'something went wrong',
                                status: 'error',
                                isClosable: true
                              })
                            }
                          })
                      }}
                    />
                  </Tooltip>
                </Flex>
              ))}
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  )
}
