import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PhoneBook from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PhoneBook />
  </StrictMode>,
)
