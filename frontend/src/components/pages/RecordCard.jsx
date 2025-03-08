import React from 'react'
import { m_names } from '../../utils/variables';
import { convertTo12HourFormat } from '../../utils/functions';

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


export default function RecordCard(props) {
    const {value,analysis,handlePopUp} = props

    return (
      
    <div className='flex min-h-[55px] mx-[10px] p-1 bg-slate-300 rounded-lg my-[2px] cursor-pointer' onClick={()=>{handlePopUp(value)}}>
        <div className='text-2xl flex justify-center items-center w-[40px] text-center'>
          {c_icons[value["category"]]}
        </div>
        <div className='ml-[2px]'>
          {analysis ? `${value["date"].slice(-2)} ${m_names[(1*value["date"].slice(5,7))-1].slice(0,3)}  ${convertTo12HourFormat(value["time"]).toLowerCase()}`: value["category"]}
        </div>
        <div className={value["recordType"]=="income"?' align-middle pr-[20px] font-semibold ml-auto text-green-600':'pr-[20px] font-semibold ml-auto text-red-400 align-middle'}>
          {value["recordType"]=="expense"?"-":""}₹{Number(value["amount"]).toFixed(2)}
        </div>
    </div>
  )
}
