import React, { useReducer, useState } from 'react'
import './BudgetCard.css'
import { m_names } from '../../utils/variables'


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

//{category:"",budget:"",month:"",email_address:""}

export default function BudgetCard(props) {
    const {value,category,spent,handleSetBudget,deleteBudget,handleEdit,setShowEdit,showEdit} = props
    const [showDeletePopup,setShowDeletePopup] = useState(false)
    

  return value ?  (
    <>
    <div className='flex mx-[10px] p-1 bg-slate-300 rounded-lg my-[2px]'>
        <div className='text-3xl ml-[5px] mr-[10px] flex justify-center mt-[4px] w-[40px] text-center'>
            {c_icons[value.category]}    
        </div>
        <div className='flex flex-col w-full mr-[20px]'>
            <h1 className='text-md'>{value.category}</h1> 
            <h1 className='text-sm'>Limit: ₹{value.budget}</h1>
            <h1 className='text-sm'>Spent: <span className={spent/value.budget > 0.8 ? 'text-red-400 font-semibold' :'text-green-600 font-semibold'}>₹{spent}</span></h1>
            <h1 className='text-sm'>Remaining: <span className={spent/value.budget > 0.8 ? 'text-red-400 font-semibold' :'text-green-600 font-semibold'}>₹{0  > value.budget-spent ? 0 : value.budget-spent}</span></h1>
            <progress className={spent/value.budget > 0.8 ? 'mb-2 custom-progress w-full md:w-[75%] rounded-lg [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-red-400 [&::-moz-progress-bar]:bg-red-400' : 'mb-2 custom-progress w-full md:w-[75%] rounded-lg [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-green-600 [&::-moz-progress-bar]:bg-green-600'} value={spent} max={value.budget}></progress>

        </div>
        <div className='z-60 relative mr-[10px] w-[20px] cursor-pointer text-right' onClick={()=>{handleEdit(value.category)}}>
            <i className="fa-solid text-2xl fa-ellipsis"></i>
            {showEdit && <div className='z-60 border-1 sticky ml-[-90px] w-fit text-nowrap float-right  rounded-lg'>
                <h1 onClick={()=>{handleSetBudget(value.category,value);setShowEdit(null)}} className='cursor-pointer hover:bg-[#aab1ba] px-1 text-left rounded-t-md'>Edit limit</h1>
                <h1 onClick={()=>{setShowDeletePopup(true)}} className='cursor-pointer hover:bg-[#aab1ba;] px-1  rounded-b-md'>Delete budget</h1> 
            </div>} 
        </div>
    </div>
    <div className={showDeletePopup ? 'opacity-25 bg-black absolute top-0 left-0 fixed w-[100vw] h-[100vh]':'hidden'} onClick={()=>{setShowDeletePopup(false)}}></div>
    <div className={showDeletePopup ? "fixed top-1/2 left-1/2 translate-x-[-50%] backdrop-blur shadow-md translate-y-[-50%] rounded-lg bg-slate-400 h-[200px] w-[300px]" : "hidden"}>
    <h1 className='text-white text-center mt-[15px] font-semibold'>ARE YOU SURE??</h1>
    <h1 className='text-white text-center '><span className='font-semibold'>DELETE</span> <span className='underline '>{value.category}</span> budget for <br></br> {m_names[value.month]} {value.year}</h1>
    <div className='flex text-white justify-center items-center gap-[20px] mt-[35px]'>
        <button className='border-2 rounded-md px-2 py-1 cursor-pointer' onClick={()=>setShowDeletePopup(false)}>CANCEL</button>
        <button className='border-2 rounded-md px-2 py-1 cursor-pointer' onClick={()=>{deleteBudget(value);setShowDeletePopup(false)}}>YES</button>
    </div>
    </div>
    
    </>

  ) : (
    <div  className='flex items-center min-h-[55px] mx-[10px] p-1 bg-slate-300 rounded-lg my-[2px]' >
        <div className='text-2xl flex justify-center items-center w-[40px] text-center'>
            {c_icons[category]}
        </div>
        <div className='ml-[2px] ml-[2px] '>
            {category}
        </div>
        <button onClick={()=>{handleSetBudget(category,value)}} className='ml-auto mr-[10px] text-sm border-2 rounded-md p-2 cursor-pointer font-semibold'>
            SET BUDGET
        </button>
    </div>
  )
}
