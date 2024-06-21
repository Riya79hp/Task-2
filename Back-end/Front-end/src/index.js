import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Home from './Listi/home';
import reportWebVitals from './reportWebVitals';
import Navbar from './Listi/navbar';
import Login from './Listi/myacclogin';
import SignUp from './Listi/myaccountsignup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
     <BrowserRouter>
     <Navbar/>
    <Routes>

    <Route path='/' element={<Home />} />
    

    <Route path='/myacc' element={<Login/>}/>
    <Route path='/myacc/signup' element={<SignUp/>}/>
    <Route path='/myacc/:query' element={<Login/>}/>
   

    </Routes>
  </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
