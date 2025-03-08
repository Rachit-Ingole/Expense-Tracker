import React, { use, useEffect, useState } from 'react'
import RecordCard from './recordCard';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Chart } from "react-google-charts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ExpenseReport.css";
import { m_names } from '../../utils/variables';
import { formatToIndianNotation,formatDate,convertTo12HourFormat } from '../../utils/functions';

export const c_icons = {
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
    const {month,year,changeMonth,updateMonth,organisedRecords,getAllRecords,topbar,showNote,setShowNote,popup,setPopup,popupVal,handlePopUp} = props
    const [dropdownVal,setDropdownVal] = useState("Expense Overview")
    const [chartData,setChartData] = useState({})
    const [recordsByCategory,setRecordsByCategory] = useState({})
    const [recordsByDay,setRecordsByDay] = useState({})
    let mandy = `${(year)?.toString().padStart(4,"0")}-${(month+1)?.toString().padStart(2,"0")}`

    useEffect(()=>{
        let newChartData = {};
        let newRecordsByCategory = {};
        if(!organisedRecords[mandy]){
            setChartData([["Category","Amount"]])
            return
        }
        
        if(dropdownVal == "Expense Overview" || dropdownVal == "Income Overview"){
            Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
                organisedRecords[mandy][monthdate].map((value,index)=>{
                    if((dropdownVal == "Expense Overview" && value.recordType == "income") || (dropdownVal == "Income Overview" && value.recordType == "expense")){
                        return
                    }
                    if(newChartData[value.category]){
                        newRecordsByCategory[value.category] = [...newRecordsByCategory[value.category],value];
                        newChartData[value.category] += 1*value.amount;
                    }else{
                        newRecordsByCategory[value.category] = [value];
                        newChartData[value.category] = 1*value.amount;
                    }
                })
            }) 

            setRecordsByCategory(newRecordsByCategory)
            setChartData([["Category","Amount"],...Object.entries(newChartData)])
        }else{
            Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
                let total = 0;
                organisedRecords[mandy][monthdate].map((value,index)=>{
                    if((dropdownVal == "Expense Flow" && value.recordType == "income") || (dropdownVal == "Income Flow" && value.recordType == "expense")){
                        return
                    }
                    total += 1*value.amount;
                })
                let dates = monthdate.split("-")
                if(!total){
                    return;
                }
                newChartData[1*dates[2]] = 1*total;
            })

            setRecordsByDay(newChartData)
            setChartData([[m_names[month],dropdownVal=="Expense Flow" ? "Expense" : "Income"],...Object.entries(newChartData)])

        }
    }
    ,[dropdownVal,organisedRecords,month,year])


    useEffect(()=>{
            getAllRecords()
    },[])
    


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

            
            <div className='flex  flex-col mt-[10px] max-h-[75%] overflow-y-auto'>
                <div>
                    {chartData.length > 1 ? 
                    <Chart
                        chartType={(dropdownVal == "Expense Overview" || dropdownVal == "Income Overview") ? "PieChart" : "LineChart"}
                        data={chartData}
                        options={(dropdownVal == "Expense Overview" || dropdownVal == "Income Overview") ? {
                            pieSliceText: "percentage",
                            pieStartAngle: 100,
                            pieHole: 0.4,
                            backgroundColor: "transparent",
                            legend:{
                                position: `${(window.innerWidth < 600) ? "bottom" :"right"}`,
                                alignment:"center"
                            }
                          } : {
                                hAxis: {
                                    title: m_names[month],
                                    minValue:0,
                                    maxValue:31,
                                },
                                vAxis: { 
                                    title: dropdownVal=="Expense Flow" ? "Expense" : "Income",
                                    gridlines: { count: 6, color: "#000000" },
                                    minorGridlines: { count: 0},
                                },
                                legend: "none",
                                backgroundColor: "transparent",
                                curveType: "none",
                                colors: [dropdownVal=="Expense Flow" ? "rgb(240, 68, 68)" : "#4CAF50"],
                                series: {
                                    0: {
                                      pointShape: "circle",
                                      pointSize: 7,
                                      pointStrokeColor: "#000000", // Border color (black)
                                      pointFillColor: "#ffffff", // Inner color (white)
                                    },
                                  }
                          }}
                        width={"100%"}
                        height={"400px"}
                    /> : <div className='h-[400px] flex flex-col justify-center items-center font-bold text-gray-600 w-full'> <i className="fa-solid fa-triangle-exclamation"></i>No data for this month</div>}
                    {(dropdownVal == "Expense Overview" || dropdownVal == "Income Overview") ? <h1 className='text-center text-xs m-2 uppercase text-gray-600 font-bold'>scroll to see records <i className="fa-solid fa-angles-down"></i></h1> :<h1 className='text-center text-xs m-2 uppercase text-gray-600 font-bold'>scroll to see calendar <i className="fa-solid fa-angles-down"></i></h1>}
                </div>
                {(dropdownVal == "Expense Flow" || dropdownVal == "Income Flow")?
                <div className="mt-1 flex p-2 md:mx-20 lg:mx-40 xl:mx-50 justify-center">
                    <Calendar 
                        activeStartDate={new Date(year, month, 1)}
                        tileDisabled={()=>{return true}}
                        tileContent={({date}) => {
                            const formattedDate = date.toISOString().split("T")[0];
                            
                            return recordsByDay[1*formattedDate.slice(-2) + 1] ? (
                                <div className={dropdownVal.startsWith("Expense") ? "text-red-600 break-all text-ellipsis text-sm font-semibold flex pr-3 items-end justify-end w-full h-full text-black" : "text-green-600 break-all text-ellipsis text-sm font-semibold flex pr-3 items-end justify-end w-full h-full text-black"}>{dropdownVal.startsWith("Expense")?"-":""}{formatToIndianNotation(recordsByDay[1*formattedDate.slice(-2) + 1])}</div>
                            ) : null;
                        }}
                        showNeighboringMonth={false}
                    />
                </div> :
                <div>
                {!organisedRecords[mandy] ? "" :
                    Object.keys(recordsByCategory).map((header,idx)=>{
                        return <div key={idx}><h4 className='font-semibold text-sm border-b-1 mr-[50%] mb-[5px]'>{header}</h4> {recordsByCategory[header].map((value,idx)=>{
                            return <RecordCard analysis={true} handlePopUp={handlePopUp} key={idx} value={value} />
                        })}</div>
                    }) 
                }
                </div>}
            </div>
            
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
