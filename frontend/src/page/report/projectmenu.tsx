import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Spacer,
  Tooltip,
  useToast,
  VStack
} from '@chakra-ui/react'
import { Icon as Iconify } from '@iconify/react'

import { ClientResponseError, Record } from 'pocketbase'
import { usePocketBase } from '../../provider/pb'

import { useEffect, useState } from 'react'

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
        <Tooltip label="all">
          <Button
            aria-label="all"
            leftIcon={<Iconify icon="bxs:collection" width="20" height="20" />}
            onClick={() => setProject(null)}
          >
            Clear
          </Button>
        </Tooltip>
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
