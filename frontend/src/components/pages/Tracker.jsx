import React, { useEffect, useState } from 'react'
import CategoryDropper from './CategoryDropper';
import RecordCard from './RecordCard';
import { m_names} from '../../utils/variables';
import { formatDate,convertTo12HourFormat } from '../../utils/functions';

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

export default function Tracker(props) {
    const {data,month,year,changeMonth,updateMonth,deleteRecord,getAllRecords,organisedRecords,topbar,showNote,setShowNote,popup,setPopup,popupVal,handlePopUp} = props

    const [error,setError] = useState("")
    let mandy = `${(year).toString().padStart(4,"0")}-${(month+1).toString().padStart(2,"0")}`

    useEffect(()=>{   
        getAllRecords()
    },[])

    const [addExpense,setAddExpense] = useState(false)
    const [dataType,setDataType] = useState("expense")
    const [category,setCategory] = useState(null)
    const [amount,setAmount]= useState(0)
    const [note,setNote] = useState("")

    const [time,setTime] = useState(`${`${new Date().getHours()}`.padStart(2,"0")}:${`${new Date().getMinutes()}`.padStart(2,"0")}`)
    const [expenseMonth,setExpenseMonth] = useState(`${`${new Date().getFullYear()}`.padStart(4,"0")}-${`${new Date().getMonth()+1}`.padStart(2,"0")}-${`${new Date().getDate()}`.padStart(2,"0")}`)

    function updateMonthandTime(){
        setTime(`${`${new Date().getHours()}`.padStart(2,"0")}:${`${new Date().getMinutes()}`.padStart(2,"0")}`);
        setExpenseMonth(`${`${new Date().getFullYear()}`.padStart(4,"0")}-${`${new Date().getMonth()+1}`.padStart(2,"0")}-${`${new Date().getDate()}`.padStart(2,"0")}`)
    }

        
    function handleSave(e){
        if(category == null){
            setError("Select a Category")
            return
        }
        if(amount <= 0 || amount == null){
            setError("Please select a valid amount")
            return
        }
        async function create_record() {
            try{
              const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/createrecord`
              const {data:actualData}  = await axios.post(API_URL,{"recordType":dataType,"category":category,"note":note,"email_address":data["email_address"],"amount":Number(amount).toString(),"time":time,"date":expenseMonth,"password":data["password"]})
              console.log(actualData)
              getAllRecords()
            }catch(err){
              setError("Input Missing") 
            }
          }
      
        create_record()
        setError("")
        setDataType("expense")
        setCategory(null)
        setNote("")
        setAmount(0)
        setAddExpense(false)

    }    

    function handleImageUpload(e){
        const formData = new FormData()
        const inputFile = document.getElementById("file")
        for (const file of inputFile.files) {
            formData.append("image", file);
        }
        async function upload_image() {
            try{
              const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload`
              const {data:actualData}  = await axios.post(API_URL,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                }})
              if(actualData.cost){
                setAmount(actualData.cost)
              }
            }catch(err){
              setError("Input Missing") 
            }
          }
      
        upload_image()

    }

  return (
    <>
    <div className='h-[100vh] md:flex mt-[10px] text-lg p-3 w-full sm:w-[75%] sm:h-[80vh] bg-slate-200 rounded-xl m-auto' >
        <div className={addExpense ? 'hidden md:block w-full relative h-full md:border-r-1 border-black':'w-full relative h-full'} >
            <div className='flex justify-center border-b-1 pb-[2px] items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="cursor-pointer fa-solid fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="cursor-pointer fa-solid fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/></div>
            
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
            <div className='flex flex-col mt-[10px] max-h-[80%] overflow-y-auto'>
                {!organisedRecords[mandy] ? "" :
                    Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
                        return <div key={idx}><h4 className='font-semibold text-sm border-b-1 mr-[50%] mb-[5px]'>{monthdate.slice(-2)} {m_names[month]}</h4> {organisedRecords[mandy][monthdate].map((value,idx)=>{
                            return <RecordCard handlePopUp={handlePopUp} key={idx} value={value} />
                        })}</div>
                    }) 
                }
            </div>

            <button className='cursor-pointer flex justify-center items-center text-white h-[45px] w-[45px] z-10 p-2 bg-blue-400 rounded-[50%] absolute bottom-[15px] right-[15px]' onClick={(e)=>{setCategory(null);updateMonthandTime();setAddExpense(!addExpense)}}>
                <i className="text-lg fa-solid fa-plus"></i>
            </button>
        </div>
        <div className='mt-[20px] md:w-[45%] h-[80%] flex flex-col justify-between' hidden={!addExpense}>
            <div className='flex w-[100%] justify-evenly text-black'>
                <div onClick={(e)=>{updateMonthandTime();setCategory(null);setDataType("income")}} className={dataType=="income" ? "text-blue-600 font-bold cursor-pointer" : "cursor-pointer"}>Income</div>
                <div onClick={(e)=>{updateMonthandTime();setCategory(null);setDataType("expense")}} className={dataType=="expense" ? "text-blue-600 font-bold  cursor-pointer" : "cursor-pointer"}>Expense</div>
            </div>


            <div className='flex flex-col p-5  align-center w-[100%] justify-evenly text-black'>
                <div className='mb-[5px]'><i className="fa-solid fa-tag"></i> Category </div>
                <CategoryDropper type={dataType} category={category} setCategory={setCategory}></CategoryDropper>
            </div>

            <div className='flex flex-col p-5 align-center justify-evenly w-[100%] text-black mb-[0px]'>
                
                    <div className=''>Note </div>
                    <textarea onChange={(e)=>setNote(e.target.value)} className='bg-white block h-[80px] rounded-lg p-1 text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50' value={note} ></textarea>
                
            </div>

            <div className='flex flex-col p-5 align-center justify-evenly w-[100%] text-black '>
                
                    <div className=''>Enter Amount </div>
                    <input onChange={(e)=>{setAmount(e.target.value)}} type='number' className='bg-white block rounded-lg p-1 text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50' value={amount}></input>
                
            </div>
            <div className='flex flex-col items-center align-center justify-evenly w-[100%] text-black '>
                <div className='text-sm'>Upload Image of Bill</div>
                <input id="file" onChange={(e)=>{handleImageUpload(e)}} className='border-1 text-sm rounded-sm' type="file" multiple />
            </div>

            <div className='flex px-5 mt-[5px] align-center justify-center w-[100%] text-black '>
                
                <div className='border-r-2 pr-[10px] border-black'><input onChange={(e)=>{setExpenseMonth(e.target.value)}} className=' outline-none' type="date" id="start" name="start" min="2022-01" value={expenseMonth}/></div>
                <div className='ml-[10px]'><input onChange={(e)=>{setTime(e.target.value)}} type="time" id="appt" name="appt" value={time}></input></div>
            
            </div>

            <div className='flex p-5 h-[40px] align-center text-sm font-bold text-red-400 justify-center w-[100%] text-black '>
                {error}
            </div>

            <div className='flex w-[100%] justify-evenly text-black mt-auto'>
                <div onClick={(e)=>{setCategory(null);setAddExpense(!addExpense)}} className='cursor-pointer'><i className="fa-solid fa-xmark"></i> Cancel</div>
                <div onClick={(e)=>{handleSave(e)}} className='cursor-pointer'><i className="fa-solid fa-check"></i> Save</div>
            </div>
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
    </>
)
}
