import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/html.css'
import './styles/font.css'
import './styles/page-header.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)