import React, { use, useEffect, useState } from 'react'
import { m_names,api_url } from '../../utils/variables';
import { groupByYearMonth,getUniqueCategories } from '../../utils/functions';
import BudgetCard from './BudgetCard';


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
    const [popupData,setPopupData] = useState({})
    const [popupLimit,setPopupLimit] = useState(0)
    const [error,setError] = useState("")
    let mandy = `${(year)?.toString().padStart(4,"0")}-${(month)?.toString().padStart(2,"0")}`
    

    async function getAllBudgets(){
            try{
                const API_URL = `${api_url}/getbudgets`
                const {data:actualData}  = await axios.post(API_URL,{"email_address":data["email_address"],"password":data["password"]})
                console.log(actualData)
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
        
    },[month,organisedRecords,budgets])


    function handleCreateBudget(){
        if(popupLimit == 0 || popupLimit == null){
            setError("Not a valid limit")
            return
        }
        async function create_budget() {
            try{
                console.log("here")
                const API_URL = `${api_url}/createbudget`
                const {data:actualData}  = await axios.post(API_URL,{"category":popupData.category,"budget":popupLimit.toString(),"email_address":data["email_address"],"password":data["password"], "month":month.toString(),"year":year.toString()})
                console.log(actualData)

            }catch(err){
                console.log(err )
                setError("Input Missing") 
            }
            }
        
        create_budget()
        setError("")
        setPopupData({})
        setPopupLimit(0)
        setBudgetPopup(false)
        getAllBudgets()

    } 

    function handleSetBudget(category,value){
        if(!value){
            setPopupData({category:category})
            setBudgetPopup(true)

        }
    }

    return (
        <>
        <div className='md:flex mt-[10px] text-lg p-3 w-full sm:w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto' >
            <div className='w-full relative h-full'>
                <div className='flex justify-center border-b-1 pb-[2px] items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="fa-solid cursor-pointer fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="fa-solid cursor-pointer fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/>
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
                <div className='flex flex-col mt-[10px] max-h-[75%] overflow-y-auto'>
                    {/* existing budgets */}
                    <h1 className='border-b-1 text-sm font-semibold mr-[50%]'>Budgets this Month</h1>
                    <div className=''>
                        {budgets[mandy] && Object.keys(budgets[mandy]).map((value,idx)=>{
                            let spent;
                            console.log(totalExpenseByCategory)
                            console.log(expenseByCategory)
                            if(totalExpenseByCategory[budgets[mandy][value].category]){
                                spent = totalExpenseByCategory[budgets[mandy][value].category];
                            }else{
                                spent = 0
                            }
                            return <BudgetCard value={budgets[mandy][value]} spent={spent} handleSetBudget={handleSetBudget} key={idx}/>
                        })}
                    </div>
                    

                    <h1 className='border-b-1 text-sm font-semibold mr-[50%]'>Not Budgeted</h1>
                    <div className=''>
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
            <h2 className='w-fit m-auto mt-[10px] text-align-center text-white font-semibold text-lg '>Assign Budget</h2>
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
                <input value={popupLimit} placeholder='0' onChange={(e)=>{if((!e.target.value || parseFloat(e.target.value) == e.target.value)){setPopupLimit(e.target.value)}}} className='border-1 ml-[10px] rounded-md p-1 focus:outline-blue-500'>
                    
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
        </>
    )
}
