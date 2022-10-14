import Layout from '../../components/Layout'
import { Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Record } from 'pocketbase'

import ProjectMenu from './projectmenu'
import DamageList from './damagelist'

export default function Damage() {
  const [project, setProject] = useState<Record | null>(null)
  useEffect(() => {
    document.title = 'Damage Control'
  })
  return (
    <Layout>
      <Box>
        <ProjectMenu setProject={setProject} />
        <Box ml="250px" p="3">
          <DamageList project={project} />
        </Box>
      </Box>
    </Layout>
  )
}
