// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

import './style/index.scss'
import 'animate.css'

import '@/registry'

// @ts-expect-error :((
BigInt.prototype['toJSON'] = function () {
  return this.toString()
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
)
