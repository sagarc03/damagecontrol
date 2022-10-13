import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { PocketBaseProvider } from './provider/pb'
import PocketBase from 'pocketbase'

const pocketBaseClient = new PocketBase('/')

const root = document.getElementById('root') as HTMLDivElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <PocketBaseProvider value={pocketBaseClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PocketBaseProvider>
    </ChakraProvider>
  </React.StrictMode>
)
