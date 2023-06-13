import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
ReactDOM.render(
 <React.StrictMode>
 <BrowserRouter>
 <App />
 </BrowserRouter>
 </React.StrictMode>,
 document.getElementById('root')
)
