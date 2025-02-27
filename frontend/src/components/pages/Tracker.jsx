import React, { use, useEffect, useState } from 'react'
import CategoryDropper from './CategoryDropper';
import RecordCard from './recordCard';


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


export default function Tracker(props) {
    const {data,setData} = props
    const [month,setMonth] = useState(new Date().getMonth())
    const [year,setYear] = useState(new Date().getFullYear())
    const [error,setError] = useState("")
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
        console.log("sorted records")
        setRecords(data.sort((a, b) => {
          const dateA = parseDateTime(a);
          const dateB = parseDateTime(b);
          return dateA - dateB;
        }));
    }


    


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

    async function getAllRecords(){
        console.log("function ran")
        try{
            const API_URL = `${api_url}/getrecords`
            const {data:actualData}  = await axios.post(API_URL,{"email_address":data["email_address"],"password":data["password"]})
            console.log(actualData)
            sortRecords(actualData)
        }catch(err){
            console.log("error in fetching records")
        }
    }

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
    const [popup,setPopup] = useState(false)
    const [popupVal,setPopupVal] = useState([])
    function handlePopUp(value){
        setPopupVal(value)
        setPopup(true)
    }

    async function deleteRecord(value){
        function convertObjectPropertiesToQuoted(obj) {
            const newObj = {};
          
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const newKey = `"${key}"`;
                newObj[newKey] = obj[key];
              }
            }
          
            return newObj;
        }
        try{
            const API_URL = `${api_url}/deleterecord`
            console.log(convertObjectPropertiesToQuoted(value))
            const {data:actualData}  = await axios.delete(API_URL,convertObjectPropertiesToQuoted(value))
            console.log(actualData)
        }catch(err){
            console.log("error in fetching records")
        }
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
        console.log(dataType,category,note,data["email_address"],Number(amount).toString(),time,expenseMonth)
        async function create_record() {
            try{
              const API_URL = `${api_url}/createrecord`
              const {data:actualData}  = await axios.post(API_URL,{"recordType":dataType,"category":category,"note":note,"email_address":data["email_address"],"amount":Number(amount).toString(),"time":time,"date":expenseMonth})
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
    let mandy = `${(year).toString().padStart(4,"0")}-${(month+1).toString().padStart(2,"0")}`

    function handleImageUpload(e){
        const formData = new FormData()
        const inputFile = document.getElementById("file")
        for (const file of inputFile.files) {
            formData.append("image", file);
        }
        async function upload_image() {
            try{
              const API_URL = `${api_url}/upload`
              const {data:actualData}  = await axios.post(API_URL,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                }})
              console.log(actualData)
            }catch(err){
              setError("Input Missing") 
            }
          }
      
        upload_image()

    }

  return (
    <>
    <div className='md:flex mt-[10px] text-lg p-3 w-full sm:w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto' >
        <div className={addExpense ? 'hidden md:block w-full relative h-full md:border-r-1 border-black':'w-full relative h-full'} >
            <div className='flex justify-center border-b-1 pb-[2px] items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="fa-solid fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="fa-solid fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/></div>
            
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
                        return <div><h4 className='font-semibold text-sm border-b-1 mr-[50%] mb-[5px]'>{monthdate.slice(-2)} {m_names[month]}</h4> {organisedRecords[mandy][monthdate].map((value,idx)=>{
                            return <RecordCard handlePopUp={handlePopUp} key={idx} value={value} />
                        })}</div>
                    }) 
                }
            </div>

            <button className='cursor-pointer flex justify-center items-center text-white h-[45px] w-[45px] z-10 p-2 bg-blue-400 rounded-[50%] absolute bottom-[15px] right-[15px]' onClick={(e)=>{setCategory(null);updateMonthandTime();setAddExpense(!addExpense)}}>
                <i className="text-lg fa-solid fa-plus"></i>
            </button>
        </div>
        <div className='md:w-[45%] h-[80%] flex flex-col justify-between' hidden={!addExpense}>
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
                <div className='text-sm'>Upload Image of Bill(PNG)</div>
                <input id="file" onChange={(e)=>{handleImageUpload(e)}} className='border-1 text-sm rounded-sm' type="file" multiple />
            </div>

            <div className='flex px-5 mt-[5px] align-center justify-center w-[100%] text-black '>
                
                <div className='border-r-2 pr-[10px] border-black'><input onChange={(e)=>{console.log(e.target.value);setExpenseMonth(e.target.value)}} className=' outline-none' type="date" id="start" name="start" min="2022-01" value={expenseMonth}/></div>
                <div className='ml-[10px]'><input onChange={(e)=>{setTime(e.target.value)}} type="time" id="appt" name="appt" value={time}></input></div>
            
            </div>

            <div className='flex p-5 align-center text-md text-red-400 justify-center w-[100%] text-black '>
                {error}
            </div>

            <div className='flex w-[100%] justify-evenly text-black mt-auto'>
                <div onClick={(e)=>{setCategory(null);setAddExpense(!addExpense)}} className='cursor-pointer'><i className="fa-solid fa-xmark"></i> Cancel</div>
                <div onClick={(e)=>{handleSave(e)}} className='cursor-pointer'><i className="fa-solid fa-check"></i> Save</div>
            </div>
        </div>
    </div>
    <div className={popup ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur translate-y-[-50%] rounded-lg bg-slate-400 h-[300px] w-[300px]" : "hidden"}>
            <div className='fixed text-xl right-2 top-1 cursor-pointer text-white' onClick={()=>{deleteRecord(popupVal)}}><i className="fa-solid fa-trash"></i></div>
            <div className='fixed text-3xl left-2 cursor-pointer text-white' onClick={(e)=>{setPopup(false)}}><i className="fa-solid fa-xmark"></i></div>
            <div className='fixed text-sm right-2 top-3/4 translate-y-[-100%] font-semibold text-white'>{formatDate(popupVal.date)}, {convertTo12HourFormat(popupVal.time)}</div>
            <div className={popupVal.recordType == "expense" ? "h-3/4 bg-red-400 rounded-t-lg text-white flex flex-col justify-center items-center" : "h-3/4 bg-green-600 rounded-t-lg text-white flex flex-col justify-center items-center"}>
                <h1 className='font-semibold uppercase text-2xl'>{popupVal.recordType}</h1>
                <h1 className='font-semibold text-xl'>₹{Number(popupVal.amount).toFixed(2)}</h1>
            </div>
            <div className='fixed bottom-0 translate-y-[25%] text-white w-full h-1/2 flex flex-col justify-center items-center'>
                <h2 className='text-2xl'>{c_icons[popupVal.category]}{popupVal.category}</h2>
            </div>
    </div>
    </>
)
}
