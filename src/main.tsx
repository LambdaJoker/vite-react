/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-01-16 15:54:52
 * @LastEditTime: 2025-02-15 14:17:33
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
