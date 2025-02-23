import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Tracker from './pages/Tracker';
import CExchange from './pages/CExchange';
import EmailReminder from './pages/EmailReminder';

export default function Main(props) {
    const {data, setData} = props;
    return (
    <Router>
        <Navbar data={data} setData={setData}/>
        <Routes>
          <Route path='/' exact element={<Tracker data={data} setData={setData}/>} />
          <Route path='/ce' element={<CExchange/>} />
          <Route path='/er' element={<EmailReminder/>} />
        </Routes>
    </Router>
    
  )
}
