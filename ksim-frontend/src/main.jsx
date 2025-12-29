import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Remove React.StrictMode to prevent duplicate API calls
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)