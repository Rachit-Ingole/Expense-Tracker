import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Tracker from './pages/Tracker';
import CExchange from './pages/CExchange';
import EmailReminder from './pages/EmailReminder';
import ExpenseReport from './pages/ExpenseReport';
import { api_url } from '../utils/variables';
import { organizeDataByMonthAndDate } from '../utils/functions';

export default function Main(props) {
    const {data, setData} = props;
    const [month,setMonth] = useState(new Date().getMonth())
    const [year,setYear] = useState(new Date().getFullYear())
    const [records,setRecords] = useState([])
    const [organisedRecords,setOrganisedRecords] = useState([])
    const [topbar,setTopbar] = useState({expense:0,income:0})
    const [popup,setPopup] = useState(false)
    const [popupVal,setPopupVal] = useState([])
    const [showNote,setShowNote] = useState(false)
    
    function handlePopUp(value){
        setPopupVal(value)
        setPopup(true)
    }

    function changeMonth(e){
      const [year,month] = e.target.value.split("-") 
      setMonth(month-1)
      setYear(year)
    }
    
    function updateMonth(operator){
      if(operator == -1){
          if(month > 0){
              setMonth(Number(month)-1);
          }else{
              setMonth(11);
              setYear(Number(year)-1);
          }
      }else{
          if(month < 11){
              setMonth(Number(month)+1);
          }else{
              setMonth(0);
              setYear(Number(year)+1);
          }
      }
    }

    function sortRecords(data) {

        const parseDateTime = (item) => {
            const [year, month, day] = item.date.split("-");
            const [hours, minutes] = item.time.split(":");
            return new Date(year, month - 1, day, hours, minutes);
        };
      
        setRecords(data.sort((a, b) => {
          const dateA = parseDateTime(a);
          const dateB = parseDateTime(b);
          return dateA - dateB;
        }));
    }

    useEffect(()=>{
        let total_expense = 0;
        let total_income = 0;
        let mandy = `${(year).toString().padStart(4,"0")}-${(month+1).toString().padStart(2,"0")}`
        if(!organisedRecords[mandy]){
            setTopbar({expense:0,income:0});  
            return
        }
        Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
            organisedRecords[mandy][monthdate].map((value,idx)=>{
                if(value.recordType == "expense"){
                    total_expense += Number(value.amount);
                }else{
                    total_income += Number(value.amount);
                }
            })
        })
        setTopbar({expense:total_expense.toFixed(2),income:total_income.toFixed(2)});             
    },[month,organisedRecords])

    useEffect(()=>{
        setOrganisedRecords(organizeDataByMonthAndDate(records))
    },[records])
    
    async function getAllRecords(){
        try{
            const API_URL = `${api_url}/getrecords`
            const {data:actualData}  = await axios.post(API_URL,{"email_address":data["email_address"],"password":data["password"]})
            console.log(actualData)
            sortRecords(actualData)
        }catch(err){
            console.log("error in fetching records")
        }
    }

    async function deleteRecord(value){
      try{
          const API_URL = `${api_url}/deleterecord`
          let newVal = {"recordType":value.recordType,"category":value.category,"amount":value.amount,"time":value.time,"date":value.date,"email_address":value.email_address,"note":value.note,"password":data.password}
          await axios.delete(API_URL,{data:newVal})
          getAllRecords()
          setShowNote(false)
          setPopup(false)
      }catch(err){
          console.log("error in deleting records")
      }
  }
    
    return (
    <Router>
        <Navbar data={data} setData={setData}/>
        <Routes>
          <Route path='/' exact element={<Tracker showNote={showNote} setShowNote={setShowNote} popup={popup} setPopup={setPopup} popupVal={popupVal} handlePopUp={handlePopUp} updateMonth={updateMonth} changeMonth={changeMonth} deleteRecord={deleteRecord} getAllRecords={getAllRecords} data={data} organisedRecords={organisedRecords} setMonth={setMonth} setYear={setYear} month={month} year={year} topbar={topbar}/>} />
          <Route path='/ea' element={<ExpenseReport showNote={showNote} setShowNote={setShowNote} popup={popup} setPopup={setPopup} popupVal={popupVal} handlePopUp={handlePopUp} updateMonth={updateMonth} changeMonth={changeMonth} deleteRecord={deleteRecord} getAllRecords={getAllRecords} organisedRecords={organisedRecords} setMonth={setMonth} setYear={setYear} month={month} year={year} topbar={topbar} />}/>
          <Route path='/ce' element={<CExchange/>} />
          <Route path='/er' element={<EmailReminder/>} />
        </Routes>
    </Router>
    
  )
}
