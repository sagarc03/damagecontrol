import {
  Center,
  Flex,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import _ from 'lodash'

import { ClientResponseError, Record } from 'pocketbase'
import { useEffect, useState } from 'react'
import { usePocketBase } from '../../provider/pb'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Last 7 days of expense'
    }
  }
}

function Report({ project }: { project: Record }) {
  const backend = usePocketBase()

  const toast = useToast()
  const [damageList, setDamageList] = useState<Record[]>([])
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
        if (err.status >= 400) {
          toast({
            title: 'something went wrong',
            status: 'error',
            isClosable: true
          })
        }
      })
  }

  const barChartData = (damageList: Record[]) => {
    function getDatesInRange(startDate: Date, i: number) {
      const date = new Date(startDate.getTime())

      const dates = []

      while (i >= 0) {
        dates.push(new Date(date))
        date.setDate(date.getDate() + 1)
        i--
      }

      return dates
    }
    const labels = getDatesInRange(new Date(), 6).reverse()

    return {
      labels: labels.map((value) => value.toDateString()),
      datasets: [
        {
          data: labels.map((for_date) => {
            return damageList
              .filter((value) => {
                const recodDate = new Date(value.created)
                return for_date.getDate() === recodDate.getDate()
              })
              .map((value) => value.cost)
              .reduce((sum, value) => sum + value, 0)
          }),
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    }
  }

  useEffect(() => getDamageForProject(), [project])
  return (
    <>
      <Text fontSize="4xl" color="gray">
        Project {project ? `/ ${project.name}` : ''}
      </Text>
      <Spacer />
      <Flex w="full">
        <Stat>
          <StatLabel>Number of Expense</StatLabel>
          <StatNumber>{damageList.length}</StatNumber>
          <StatHelpText>
            {new Date(
              _.min(damageList.map((value): string => value.created))!
            ).toLocaleDateString('en-us', {
              year: '2-digit',
              month: 'short',
              day: '2-digit'
            })}
            {' - '}
            {new Date(
              _.max(damageList.map((value): string => value.created))!
            ).toLocaleDateString('en-us', {
              year: '2-digit',
              month: 'short',
              day: '2-digit'
            })}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Total Expense</StatLabel>
          <StatNumber>
            {damageList
              .map((value): number => value.cost)
              .reduce((sum, value) => sum + value, 0)}
          </StatNumber>
          <StatHelpText>
            {new Date(
              _.min(damageList.map((value): string => value.created))!
            ).toLocaleDateString('en-us', {
              year: '2-digit',
              month: 'short',
              day: '2-digit'
            })}
            {' - '}
            {new Date(
              _.max(damageList.map((value): string => value.created))!
            ).toLocaleDateString('en-us', {
              year: '2-digit',
              month: 'short',
              day: '2-digit'
            })}
          </StatHelpText>
        </Stat>
      </Flex>
      <Spacer />
      <TableContainer w="300px">
        <Text fontSize="xl">Top 5 expenses</Text>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th isNumeric>Expense</Th>
            </Tr>
          </Thead>
          <Tbody>
            {damageList
              .sort((a, b) => (a.cost < b.cost ? 1 : a.cost > b.cost ? -1 : 0))
              .slice(0, 4)
              .map((value) => (
                <Tr key={value.id}>
                  <Td>{value.name}</Td>
                  <Td isNumeric>{value.cost}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Bar options={options} data={barChartData(damageList)} />
    </>
  )
}

export default function ReportPage({ project }: { project: Record | null }) {
  return (
    <>
      {project ? (
        <Report project={project} />
      ) : (
        <Center h="100vh">
          <Text>Select a project to begin</Text>
        </Center>
      )}
    </>
  )
}
