/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: main
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-06-18 19:23:11
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
