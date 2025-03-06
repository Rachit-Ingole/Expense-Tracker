import React, { useEffect, useState } from 'react'
import RecordCard from './recordCard';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Chart } from "react-google-charts";

const api_url = "http://127.0.0.1:8000/api/v1";
const m_names = ['January', 'February', 'March', 
    'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'];
    const c_icons = {
        "Food": <i className="fa-solid fa-utensils mr-[5px]"></i>,
        "Beauty": <i className="fa-solid fa-star mr-[5px]"></i>,
        "Bills": <i className="fa-solid fa-file-invoice-dollar mr-[5px]"></i>,
        "Car": <i className="fa-solid fa-car mr-[5px]"></i>,
        "Clothing": <i className="fa-solid fa-tshirt mr-[5px]"></i>,
        "Education": <i className="fa-solid fa-graduation-cap mr-[5px]"></i>,
        "Electronics": <i className="fa-solid fa-tv mr-[5px]"></i>,
        "Entertainment": <i className="fa-solid fa-film mr-[5px]"></i>,
        "Health": <i className="fa-solid fa-heartbeat mr-[5px]"></i>,
        "Home": <i className="fa-solid fa-home mr-[5px]"></i>,
        "Insurance": <i className="fa-solid fa-shield-alt mr-[5px]"></i>,
        "Shopping": <i className="fa-solid fa-shopping-cart mr-[5px]"></i>,
        "Social": <i className="fa-solid fa-users mr-[5px]"></i>,
        "Sports": <i className="fa-solid fa-futbol mr-[5px]"></i>,
        "Tax": <i className="fa-solid fa-calculator mr-[5px]"></i>,
        "Transportation": <i className="fa-solid fa-bus mr-[5px]"></i>,
        "Awards": <i className="fa-solid fa-trophy mr-[5px]"></i>,
        "Coupons": <i className="fa-solid fa-ticket-alt mr-[5px]"></i>,
        "Grants": <i className="fa-solid fa-hand-holding-usd mr-[5px]"></i>,
        "Lottery": <i className="fa-solid fa-money-bill-wave mr-[5px]"></i>,
        "Refunds": <i className="fa-solid fa-receipt mr-[5px]"></i>,
        "Rental": <i className="fa-solid fa-home mr-[5px]"></i>,
        "Salary": <i className="fa-solid fa-wallet mr-[5px]"></i>,
        "Sale": <i className="fa-solid fa-tags mr-[5px]"></i>,
        "Others": <i className="fa-solid fa-ellipsis-h mr-[5px]"></i>
      }


export default function ExpenseReport(props) {
    const {data,setData,month,setMonth,year,setYear,records,setRecords,organisedRecords,getAllRecords,setOrganisedRecords,topbar,setTopbar} = props
    const [dropdownVal,setDropdownVal] = useState("Expense Overview")
    const [chartData,setChartData] = useState({})
    let mandy = `${(year)?.toString().padStart(4,"0")}-${(month+1)?.toString().padStart(2,"0")}`

    useEffect(()=>{
        let newChartData = {};
        if(!organisedRecords[mandy]){
            setChartData([["Category","Amount"]])
            return
        }

        Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
            organisedRecords[mandy][monthdate].map((value,index)=>{
                if((dropdownVal == "Expense Overview" && value.recordType == "income") || (dropdownVal == "Income Overview" && value.recordType == "expense")){
                    return
                }
                if(newChartData[value.category]){
                    newChartData[value.category] += 1*value.amount;
                }else{
                    newChartData[value.category] = 1*value.amount;
                }
            })
        }) 
        console.log([...Object.entries(newChartData)])
        setChartData([["Category","Amount"],...Object.entries(newChartData)])
    },[dropdownVal,organisedRecords,month,year])


    useEffect(()=>{   
            getAllRecords()
    },[])
    

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
    const [showNote,setShowNote] = useState(false)
    const [popup,setPopup] = useState(false)
    const [popupVal,setPopupVal] = useState([])
    function handlePopUp(value){
        setPopupVal(value)
        setPopup(true)
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
        
    function formatDate(dateString) {
        if(!dateString){return}
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const [year, month, day] = dateString.split("-");
        const monthName = months[parseInt(month) - 1];
        
        return `${monthName} ${parseInt(day)}, ${year}`;
      }

      function convertTo12HourFormat(timeString) {
        if(!timeString){return}
        const [hour, minute] = timeString.split(":");
        let period = "AM";
        let hour12 = parseInt(hour);
      
        if (hour12 >= 12) {
          period = "PM";
          if (hour12 > 12) {
            hour12 -= 12;
          }
        } else if (hour12 === 0) {
          hour12 = 12;
        }
      
        return `${hour12}:${minute} ${period}`;
      }
    



  return (
    <>
    <div className='md:flex mt-[10px] text-lg p-3 w-full sm:w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto' >
        <div className='w-full relative h-full' >
            <div className='flex justify-center border-b-1 pb-[2px] items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="fa-solid cursor-pointer fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="fa-solid cursor-pointer fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/></div>
            
            <div className='flex justify-evenly text-sm border-b-1'>
                <div className='text-center'>
                    <h4 className='font-semibold text-xs'>EXPENSE</h4>
                    <h4 className='text-red-400 font-bold'>₹{topbar.expense}</h4>
                </div>
                <div className='text-center'>
                    <h4 className='font-semibold text-xs'>INCOME</h4>
                    <h4 className='text-green-600 font-bold'> ₹{topbar.income}</h4>
                </div>
                <div className='text-center'>
                    <h4 className='font-semibold text-xs'>TOTAL</h4>
                    <h4 className={Number(topbar.income)>=Number(topbar.expense)?"text-green-600 font-bold":"text-red-400 font-bold"}>₹{Number(topbar.income)>=Number(topbar.expense)?(topbar.income-topbar.expense).toFixed(2):(topbar.expense-topbar.income).toFixed(2)}</h4>
                </div>
            </div>

            <div className='mt-1 '>
                <Menu>
                    <div className='flex relative align-center justify-center'>
                        <MenuButton className="inline-flex w-full sm:w-[50%] cursor-pointer text-white justify-center gap-x-1.5 rounded-lg bg-blue-400 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 hover:text-black ">
                        {dropdownVal}
                        <i className="fa-solid mt-[4px] fa-angle-down"></i>
                        </MenuButton>
                        <MenuItems
                        transition
                        className="absolute top-7 z-10 mt-2 w-full sm:w-[50%] origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in max-h-[200px]">
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        className="cursor-pointer block w-full font-semibold flex justify-center px-4 py-1 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setDropdownVal("Expense Overview")}
                                    >
                                        Expense Overview
                                    </a>
                                </MenuItem>
                            </div>
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        className="cursor-pointer block w-full font-semibold flex justify-center px-4 py-1 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setDropdownVal("Income Overview")}
                                    >
                                        Income Overview
                                    </a>
                                </MenuItem>
                            </div>
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        className="cursor-pointer block w-full font-semibold flex justify-center px-4 py-1 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setDropdownVal("Expense Flow")}
                                    >
                                        Expense Flow
                                    </a>
                                </MenuItem>
                            </div>
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        className="cursor-pointer block w-full font-semibold flex justify-center px-4 py-1 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setDropdownVal("Income Flow")}
                                    >
                                        Income Flow
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </div>
                    
                </Menu>
            </div>
            <div className='flex flex-col mt-[10px] max-h-[75%] overflow-y-auto'>
                <div>
                    {chartData.length > 1 ? <Chart
                        chartType="PieChart"
                        data={chartData}
                        options={{
                            pieStartAngle: 100,
                            backgroundColor: "transparent",
                            legend:{
                                position: `${(window.innerWidth < 600) ? "bottom" :"right"}`,
                                alignment:"center"
                            }
                          }}
                        width={"100%"}
                        height={"400px"}
                    /> : <div className='h-[400px] flex flex-col justify-center items-center font-bold text-gray-600 w-full'> <i className="fa-solid fa-triangle-exclamation"></i>No data for this month</div>}
                    <h1 className='text-center text-xs m-2 uppercase text-gray-600 font-bold'>scroll to see records <i className="fa-solid fa-angles-down"></i></h1>
                </div>
                <div>
                {!organisedRecords[mandy] ? "" :
                    Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
                        return <div key={idx}><h4 className='font-semibold text-sm border-b-1 mr-[50%] mb-[5px]'>{monthdate.slice(-2)} {m_names[month]}</h4> {organisedRecords[mandy][monthdate].map((value,idx)=>{
                            return <RecordCard handlePopUp={handlePopUp} key={idx} value={value} />
                        })}</div>
                    }) 
                }
                </div>
            </div>

            <button className='cursor-pointer flex justify-center items-center text-white h-[45px] w-[45px] z-10 p-2 bg-blue-400 rounded-[50%] absolute bottom-[15px] right-[15px]' onClick={(e)=>{console.log("Unpurposed button")}}>
                <i className="text-lg fa-solid fa-plus"></i>
            </button>
        </div>
        <div className={popup ? 'opacity-25 bg-black absolute top-0 left-0 fixed w-[100vw] h-[100vh]':'hidden'} onClick={(e)=>{setShowNote(false);setPopup(false)}}></div>
        <div className={popup ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur shadow-md translate-y-[-50%] rounded-lg bg-slate-400 h-[300px] w-[300px]" : "hidden"}>
                <div className='fixed text-xl right-2 mt-[1px] top-1 cursor-pointer text-white' onClick={()=>{deleteRecord(popupVal)}}><i className="fa-solid fa-trash"></i></div>
                <div className='fixed text-3xl left-2 cursor-pointer text-white' onClick={(e)=>{setPopup(false)}}><i className="fa-solid fa-xmark"></i></div>
                <div className='fixed text-3xl right-9 top-2 border-2 rounded-lg px-2 cursor-pointer text-sm text-white' onClick={()=>{if(popupVal.note)setShowNote(true)}}>{popupVal.note ?  "Note" : "No Note"}</div>
                <div className='fixed text-sm right-2 top-3/4 translate-y-[-100%] font-semibold text-white'>{formatDate(popupVal.date)}, {convertTo12HourFormat(popupVal.time)}</div>
                <div className={popupVal.recordType == "expense" ? "h-3/4 bg-red-400 rounded-t-lg text-white flex flex-col justify-center items-center" : "h-3/4 bg-green-600 rounded-t-lg text-white flex flex-col justify-center items-center"}>
                    <h1 className='font-semibold uppercase text-2xl'>{popupVal.recordType}</h1>
                    <h1 className='font-semibold text-xl'>₹{Number(popupVal.amount).toFixed(2)}</h1>
                </div>
                <div className='fixed bottom-0 translate-y-[25%] text-white w-full h-1/2 flex flex-col justify-center items-center'>
                    <h2 className='text-2xl'>{c_icons[popupVal.category]}{popupVal.category}</h2>
                </div>
        </div>
        <div className={showNote ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur shadow-md translate-y-[-50%] rounded-lg bg-slate-400 h-[300px] w-[300px]" : "hidden"}>
                <div className='fixed text-3xl left-2 cursor-pointer text-white' onClick={(e)=>{setShowNote(false)}}><i className="fa-solid fa-xmark"></i></div>

                <div className={popupVal.recordType == "expense" ? "h-[40px] bg-red-400 rounded-t-lg text-white flex flex-col justify-center items-center" : "h-[40px] bg-green-600 rounded-t-lg text-white flex flex-col justify-center items-center"}>
                    <h1 className='font-semibold text-xl'>₹{Number(popupVal.amount).toFixed(2)} - {popupVal.category}</h1>
                </div>
                <div className='text-white p-5 max-h-[80%] overflow-y-auto'>{popupVal.note}</div>
                
        </div>
    </div>
    </>
)
}
