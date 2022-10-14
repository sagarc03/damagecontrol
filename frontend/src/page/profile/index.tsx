import Layout from '../../components/Layout'
import { Box, Divider, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
export default function Profile() {
  useEffect(() => {
    document.title = 'User Profile'
  })
  return (
    <Layout>
      <Box>
        <Text fontSize="4xl" color="gray">
          User Profile
        </Text>
        <Divider color="black" orientation="horizontal" />
        <Box p="3"></Box>
      </Box>
    </Layout>
  )
}
