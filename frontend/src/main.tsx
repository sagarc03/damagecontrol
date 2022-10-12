import React from 'react'
import ReactDOM from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const root = document.getElementById('root') as HTMLDivElement
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
