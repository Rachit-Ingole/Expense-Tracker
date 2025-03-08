import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar';
import Tracker from './pages/Tracker';
import CExchange from './pages/CExchange';
import EmailReminder from './pages/EmailReminder';
import ExpenseReport from './pages/ExpenseReport';
const api_url = "http://127.0.0.1:8000/api/v1";
export default function Main(props) {
    const {data, setData} = props;
    const [month,setMonth] = useState(new Date().getMonth())
    const [year,setYear] = useState(new Date().getFullYear())
    const [records,setRecords] = useState([])
    const [organisedRecords,setOrganisedRecords] = useState([])
    const [topbar,setTopbar] = useState({expense:0,income:0})
  
    function sortRecords(data) {
        // Helper function to parse 'date' and 'time'
        const parseDateTime = (item) => {
            const [year, month, day] = item.date.split("-");
            const [hours, minutes] = item.time.split(":");
            return new Date(year, month - 1, day, hours, minutes);
        };
      
        // Sort the array
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
        function organizeDataByMonthAndDate(data) {
            const result = {};
          
            // Helper function to parse 'date' and 'time'
            const parseDateTime = (item) => {
              const [year, month, day] = item.date.split("-");
              const [hours, minutes] = item.time.split("-");
              return new Date(year, month - 1, day, hours, minutes);
            };
          
            // Sort the array by 'date' and 'time'
            const sortedData = data.sort((a, b) => {
              const dateA = parseDateTime(a);
              const dateB = parseDateTime(b);
              return dateA - dateB;
            });
          
            // Organize data by months and dates
            sortedData.forEach(item => {
              const monthKey = item.date.slice(0, 7); // YYYY-MM
              const dateKey = item.date; // YYYY-MM-DD
          
              if (!result[monthKey]) {
                result[monthKey] = {};
              }
              if (!result[monthKey][dateKey]) {
                result[monthKey][dateKey] = [];
              }
              result[monthKey][dateKey].push(item); // Push the entire item, preserving all other data
            });
          
            return result;
        }
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
          <Route path='/' exact element={<Tracker deleteRecord={deleteRecord} getAllRecords={getAllRecords} data={data} organisedRecords={organisedRecords} setMonth={setMonth} setYear={setYear} month={month} year={year} topbar={topbar}/>} />
          <Route path='/ea' element={<ExpenseReport deleteRecord={deleteRecord} getAllRecords={getAllRecords} organisedRecords={organisedRecords} setMonth={setMonth} setYear={setYear} month={month} year={year} topbar={topbar} />}/>
          <Route path='/ce' element={<CExchange/>} />
          <Route path='/er' element={<EmailReminder/>} />
        </Routes>
    </Router>
    
  )
}
