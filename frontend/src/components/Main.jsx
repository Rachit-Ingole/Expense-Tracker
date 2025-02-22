import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Tracker from './pages/Tracker';
import TaxCalc from './pages/TaxCalc';

export default function Main(props) {
    const {data,setData} = props;
    return (
    <Router>
        <Navbar data={data} setData={setData}/>
        <Routes>
          <Route path='/' exact element={<Tracker/>} />
          <Route path='/tc' element={<TaxCalc/>} />
        </Routes>
    </Router>
    
  )
}
