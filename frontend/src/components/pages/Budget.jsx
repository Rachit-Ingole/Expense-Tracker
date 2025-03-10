import React, { use, useEffect, useState } from 'react'
import { m_names } from '../../utils/variables';
import { groupByYearMonth,getUniqueCategories } from '../../utils/functions';
import BudgetCard from './BudgetCard';
import { formatDate,convertTo12HourFormat,formatToIndianNotation } from '../../utils/functions';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const categories = [
    "Food", "Beauty", "Bills", "Car", "Clothing", "Education", "Electronics", 
    "Entertainment", "Health", "Home", "Insurance", "Shopping", "Social", 
    "Sports", "Tax", "Transportation", "Others"
];

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


export default function Budget(props) {
    const {month,year,updateMonth,changeMonth,data,organisedRecords,getAllRecords} = props;
    const [topbar,setTopbar] = useState({budget:0,spent:0})

    const [expenseByCategory,setExpenseByCategory] = useState({})
    const [budgets,setBudgets] = useState({})
    const [totalExpenseByCategory,setTotalExpenseByCategory] = useState({})
    const [existingCategories,setExistingCategories] = useState([])

    const [budgetPopup,setBudgetPopup] = useState(false)
    const [popupData,setPopupData] = useState({limit:0,category:null})
    
    const [error,setError] = useState("")
    let mandy = `${(year)?.toString().padStart(4,"0")}-${(month)?.toString().padStart(2,"0")}`
    

    async function getAllBudgets(){
            try{
                const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getbudgets`
                const {data:actualData}  = await axios.post(API_URL,{"email_address":data["email_address"],"password":data["password"]})
                let newBuds = groupByYearMonth(actualData)
                setBudgets(newBuds)
                setExistingCategories(getUniqueCategories(newBuds[mandy]))
                
            }catch(err){
                console.log(err)
                console.log("error in fetching budgets")
            }
    }

    useEffect(()=>{   
        getAllRecords()
        getAllBudgets()
    },[])
    
    
    useEffect(()=>{
        let newChartData = {};
        let newRecordsByCategory = {};
        
        let mandy = `${(year)?.toString().padStart(4,"0")}-${(month+1)?.toString().padStart(2,"0")}`
        if(!organisedRecords[mandy]){
            return
        }

        Object.keys(organisedRecords[mandy]).map((monthdate,idx)=>{
            organisedRecords[mandy][monthdate].map((value,index)=>{
                if(value.recordType == "income"){
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

        setExpenseByCategory(newRecordsByCategory)
        setTotalExpenseByCategory(newChartData)
        mandy = `${(year)?.toString().padStart(4,"0")}-${(month)?.toString().padStart(2,"0")}`

        let totalSpent = 0;
        let totalBudget = 0;
        if(!budgets[mandy]){
            setTopbar({budget:0,spent:0})
            return
        }
        Object.keys(budgets[mandy]).map((value,idx)=>{
            totalBudget += 1 * budgets[mandy][value].budget
            if(newChartData[budgets[mandy][value].category]){
                totalSpent += 1 * newChartData[budgets[mandy][value].category];
            }
        })
        setTopbar({budget:totalBudget,spent:totalSpent})

        
    },[month,organisedRecords,budgets])

    

    function handleCreateBudget(){
        if(popupData.limit == 0 || popupData.limit == null){
            setError("Not a valid limit")
            return
        }
        async function create_budget() {
            try{
                const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/createbudget`
                await axios.post(API_URL,{"category":popupData.category,"budget":popupData.limit.toString(),"email_address":data["email_address"],"password":data["password"], "month":month.toString(),"year":year.toString()})
                getAllBudgets()

            }catch(err){
                console.log(err )
                setError("Input Missing") 
            }
            }
        
        create_budget()
        setError("")
        setPopupData({limit:0,category:null})
        setBudgetPopup(false)
        

    } 

    function handleSetBudget(category,value){
        if(!value){
            setPopupData({category:category,limit:0})
            setBudgetPopup(true)
            return
        }
        
        setPopupData({category:category,limit:value.budget})
        setBudgetPopup(true)

    }

    const [showEdit,setShowEdit] = useState(null)
    function handleEdit(category){
        if(showEdit == category){
            setShowEdit(null)
            return
        }
        setShowEdit(category)
    }

    const [showRecords,setShowRecords] = useState(false)
    function handleShowRecords(value,spent){
        setShowRecords({...value,spent:spent})
    }

    async function deleteBudget(value){
        try{
            const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/deletebudget`
            let newVal = {"category":value.category,"budget":value.budget,"month":month.toString(),"year":year.toString(),"email_address":value.email_address,"password":data.password}
            await axios.delete(API_URL,{data:newVal})
            getAllBudgets()
        }catch(err){
            console.log(err)
            console.log("error in deleting budget")
        }
    }

    return (
        <>
        <div className='h-[100vh] md:flex mt-[10px] text-lg p-3 w-full sm:w-[75%] sm:h-[80vh] bg-slate-200 rounded-xl m-auto' >
            <div className='w-full relative h-full' >
                <div onTouchStart={()=>{setShowEdit(null)}} onMouseDown={()=>{setShowEdit(null)}} className='z-60 flex justify-center border-b-1 pb-[2px] items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="fa-solid cursor-pointer fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="fa-solid cursor-pointer fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/>
                </div>
                
                <div className='flex justify-evenly text-sm border-b-1'>
                    <div className='text-center'>
                        <h4 className='font-semibold text-xs'>TOTAL BUDGET</h4>
                        <h4 className='text-black font-bold'>₹{topbar.budget}</h4>
                    </div>
                    <div className='text-center'>
                        <h4 className='font-semibold text-xs'>TOTAL SPENT</h4>
                        <h4 className='text-red-400 font-bold'> ₹{topbar.spent}</h4>
                    </div>
                </div>
                <div className='flex flex-col mt-[10px] max-h-[80%] overflow-y-auto' >

                    <h1 className='border-b-1 text-sm font-semibold mr-[50%]'>Budgets this Month</h1>
                    <div className='relative'>
                        {budgets[mandy] && Object.keys(budgets[mandy]).map((value,idx)=>{
                            let spent;
                            if(totalExpenseByCategory[budgets[mandy][value].category]){
                                spent = totalExpenseByCategory[budgets[mandy][value].category];
                            }else{
                                spent = 0
                            }

                            return <BudgetCard handleShowRecords={handleShowRecords} value={budgets[mandy][value]} handleEdit={handleEdit} showEdit={budgets[mandy][value].category == showEdit} setShowEdit={setShowEdit} deleteBudget={deleteBudget} spent={spent} handleSetBudget={handleSetBudget} key={idx}/>
                        })}
                    </div>
                    

                    <h1 className='border-b-1 text-sm font-semibold mr-[50%]' >Not Budgeted</h1>
                    <div className='' onTouchStart={()=>{setShowEdit(null)}} onMouseDown={()=>{setShowEdit(null)}}>
                        {categories.map((category,idx)=>{
                            if(!existingCategories.includes(category)){
                                return <BudgetCard category={category} handleSetBudget={handleSetBudget} key={idx}/>
                            }
                        })}
                    </div>
                </div>
                
            </div>
        </div>
        <div className={budgetPopup ? 'opacity-25 bg-black absolute top-0 left-0 fixed w-[100vw] h-[100vh]':'hidden'} onClick={()=>{setBudgetPopup(false)}}></div>
        <div className={budgetPopup ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur shadow-md translate-y-[-50%] rounded-lg bg-slate-400 h-[280px] w-[300px]" : "hidden"}>
            <div onClick={()=>setBudgetPopup(false)} className='fixed text-3xl left-2 cursor-pointer text-white' ><i className="fa-solid fa-xmark"></i></div>
            <h2 className='w-fit m-auto mt-[10px] text-center text-white font-semibold text-lg '>Assign Budget</h2>
            <div className='flex justify-center items-center h-[80px] text-white'>
                <div className='text-3xl flex justify-center items-center w-[40px] text-center'>
                    {c_icons[popupData.category]} 
                </div>
                <div className='ml-[2px] text-2xl'>
                    {popupData.category}
                </div>
            </div>
            <div className='flex justify-center items-center text-white mb-[10px]'>
                {m_names[month]}
            </div>
            <div className='flex justify-center items-center text-white'>
                <div className='text-lg'>
                    Limit
                </div>
                
                <input value={popupData.limit} placeholder='0' onChange={(e)=>{if((!e.target.value || parseFloat(e.target.value) == e.target.value)){setPopupData({...popupData,limit:e.target.value})}}} className='border-1 ml-[10px] rounded-md p-1 focus:outline-blue-500'>
                    
                </input>
                
            </div>
            <div className='text-red-200 text-sm mt-[15px] font-semibold flex justify-center items-center'>
                    {error}
            </div>
            <div className='fixed bottom-4 translate-y-[25%] text-white w-full flex flex-col justify-center items-center'>
                <button onClick={()=>{handleCreateBudget()}} className='hover:border-blue-500 hover:text-blue-500 mt-auto cursor-pointer p-2 rounded-lg mb-[5px] border-2'>
                    SET BUDGET
                </button>
            </div>
        </div>

        <div className={showRecords ? 'opacity-25 bg-black absolute top-0 left-0 fixed w-[100vw] h-[100vh]':'hidden'} onClick={()=>{setShowRecords(null)}}></div>
        <div className={showRecords ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur shadow-md translate-y-[-50%] rounded-lg bg-slate-400 h-[350px] w-full sm:w-[400px]" : "hidden"}>
            <h2 className='w-fit m-auto mt-[10px] text-white font-semibold text-lg px-2 text-center'>Records of {c_icons[showRecords?.category]} <span className='underline'>{showRecords?.category}</span> in {m_names[month]} {year}</h2>
            <div className='pt-5 h-[265px] flex flex-col overflow-y-auto gap-[2px] text-white mb-[10px]'>
                <div className='mx-auto flex justify-center w-[200px]'>
                    <CircularProgressbar value={1*showRecords?.spent} maxValue={1*showRecords?.budget} text={`${(showRecords?.spent/showRecords?.budget)*100}%`} styles={buildStyles({textColor:"#FFFFFF"})}/>
                </div>
                <div className='mx-auto text-sm my-[15px] font-semibold'>SCROLL TO SEE RECORDS <i className="fa-solid fa-angles-down"></i></div>
                {expenseByCategory[showRecords?.category] ? Object.keys(expenseByCategory[showRecords.category]).map((idx)=>{
                    return <div key={idx} className='w-[90%] min-h-[40px] flex items-center mx-auto px-2 bg-slate-500 rounded-lg'>
                        <h1>{formatDate(expenseByCategory[showRecords.category][idx].date).split(",")[0]} - {convertTo12HourFormat(expenseByCategory[showRecords.category][idx].time)}</h1> 
                        <h1 className='text-white font-semibold text-lg ml-auto mr-[5px]'>₹{formatToIndianNotation(1*expenseByCategory[showRecords.category][idx].amount)}</h1>
                    </div>
                }) : <div className='h-[400px] flex flex-col justify-center items-center font-bold text-white w-full'> <i className="fa-solid fa-triangle-exclamation"></i>No Records</div>}
            </div>
            <div onClick={()=>{setShowRecords(null)}} className='cursor-pointer text-white text-lg border-1 w-fit px-2 rounded-md text-center mx-auto'>
                Close
            </div>
            
        </div>
        </>
    )
}
