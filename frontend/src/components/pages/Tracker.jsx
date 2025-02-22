import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function CategoryDropper(props) {
    const {type,setCategory,category} = props


  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 ">
          {category ? category : "Select Category"}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

    {type == "expense" ?
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in max-h-[200px] overflow-y-scroll">
        <div className="py-1">
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Food")}
            >
                <i className="fa-solid fa-utensils mr-[5px]"></i>Food
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Beauty")}
            >
                <i className="fa-solid fa-ghost mr-[5px]"></i>Beauty
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Bills")}
            >
                <i className="fa-solid fa-file-invoice-dollar mr-[5px]"></i>Bills
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Car")}
            >
                <i className="fa-solid fa-car mr-[5px]"></i>Car
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Clothing")}
            >
                <i className="fa-solid fa-shirt mr-[5px]"></i>Clothing
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Education")}
            > 
                <i className="fa-solid fa-pencil mr-[5px]"></i>Education
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Electronics")}
            >
                <i className="fa-solid fa-plug mr-[5px]"></i>Electronics
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Entertainment")}
            >
                <i className="fa-solid fa-tv mr-[5px]"></i>Entertainment
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Health")}
            >
                <i className="fa-solid fa-heart mr-[5px]"></i>Health
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Home")}
            >
                <i className="fa-solid fa-house mr-[5px]"></i>Home
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Insurance")}
            >
                <i className="fa-solid fa-file-invoice mr-[5px]"></i>Insurance
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Shopping")}
            >
                <i className="fa-solid fa-cart-shopping mr-[5px]"></i>Shopping
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Social")}
            >
                <i className="fa-solid fa-user-group mr-[5px]"></i>Social
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Sports")}
            >
                <i className="fa-solid fa-baseball-bat-ball mr-[5px]"></i>Sports
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Tax")}
            >
                <i className="fa-solid fa-money-check-dollar mr-[5px]"></i>Tax
            </a>
        </MenuItem>
        <MenuItem>
            <a
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Transportation")}
            >
                <i className="fa-solid fa-bus mr-[5px]"></i>Transportation
            </a>
        </MenuItem>
        <MenuItem>
            <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Others")}>
                <i className="fa-solid fa-ellipsis-h mr-[5px]"></i>Others
            </a>
    </MenuItem>


        </div>
      </MenuItems>
      :
        <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in max-h-[200px] overflow-y-scroll">
            <div className="py-1">
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Awards")}>
                            <i className="fa-solid fa-trophy mr-[5px]"></i>Awards
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Coupons")}>
                            <i className="fa-solid fa-ticket-alt mr-[5px]"></i>Coupons
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Grants")}>
                            <i className="fa-solid fa-hand-holding-usd mr-[5px]"></i>Grants
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Lottery")}>
                            <i className="fa-solid fa-money-bill-wave mr-[5px]"></i>Lottery
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Refunds")}>
                            <i className="fa-solid fa-receipt mr-[5px]"></i>Refunds
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Rental")}>
                            <i className="fa-solid fa-home mr-[5px]"></i>Rental
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Salary")}>
                            <i className="fa-solid fa-wallet mr-[5px]"></i>Salary
                        </a>
            </MenuItem>
            <MenuItem>
                        <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Sale")}>
                            <i className="fa-solid fa-tags mr-[5px]"></i>Sale
                        </a>
            </MenuItem>
            <MenuItem>
            <a className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden" onClick={(e)=>setCategory("Others")}>
                <i className="fa-solid fa-ellipsis-h mr-[5px]"></i>Others
            </a>
    </MenuItem>
            </div>
        </MenuItems>
    }
    </Menu>
  )
}

const m_names = ['January', 'February', 'March', 
    'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'];
export default function Tracker() {
    const [month,setMonth] = useState(new Date().getMonth())
    const [year,setYear] = useState(new Date().getFullYear())

    const [addExpense,setAddExpense] = useState(false)
    const [dataType,setDataType] = useState("expense")
    const [category,setCategory] = useState(null)
    const [time,setTime] = useState(null)
    const [expenseMonth,setExpenseMonth] = useState(null)

    function updateMonthandTime(){
        setTime(`${`${new Date().getHours()}`.padStart(2,"0")}:${`${new Date().getMinutes()}`.padStart(2,"0")}`);
        setExpenseMonth(`${`${new Date().getFullYear()}`.padStart(4,"0")}-${`${new Date().getMonth()+1}`.padStart(2,"0")}`)
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
  return (
    <div className='md:flex mt-[10px] text-lg p-3 w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto' >
        <div className={addExpense ? 'hidden md:block w-full relative h-full md:border-r-1 border-black':'w-full relative h-full'} >
            <div className='flex justify-center items-center gap-[10px] text-lg' ><i onClick={(e)=>updateMonth(-1)} className="fa-solid fa-arrow-left"></i><span className='w-[150px] text-center'>{m_names[month]}, {year}</span> <i onClick={(e)=>updateMonth(1)} className="fa-solid fa-arrow-right"></i> <input onChange={(e)=>changeMonth(e)} className=' outline-none w-[20px]' type="month" id="start" name="start" min="2018-03"/></div>
            
            
            DATAAA

            <button className='cursor-pointer flex justify-center items-center text-white h-[45px] w-[45px] z-10 p-2 bg-blue-400 rounded-[50%] absolute bottom-[15px] right-[15px]' onClick={(e)=>{updateMonthandTime();setAddExpense(!addExpense)}}>
                <i className="text-lg fa-solid fa-plus"></i>
            </button>
        </div>
        <div className='md:w-[45%] h-[100%] flex flex-col justify-between' hidden={!addExpense}>
            <div className='flex w-[100%] justify-evenly text-black'>
                <div onClick={(e)=>{updateMonthandTime();setCategory(null);setDataType("income")}} className={dataType=="income" ? "text-blue-600 font-bold cursor-pointer" : "cursor-pointer"}>Income</div>
                <div onClick={(e)=>{updateMonthandTime();setCategory(null);setDataType("expense")}} className={dataType=="expense" ? "text-blue-600 font-bold  cursor-pointer" : "cursor-pointer"}>Expense</div>
            </div>


            <div className='flex flex-col p-5  align-center w-[100%] justify-evenly text-black mt-[20px]'>
                <div className='mb-[5px]'><i className="fa-solid fa-tag"></i> Category </div>
                <CategoryDropper type={dataType} category={category} setCategory={setCategory}></CategoryDropper>
            </div>

            <div className='flex flex-col p-5 align-center justify-evenly w-[100%] text-black '>
                
                    <div className=''>Note </div>
                    <textarea className='bg-white block h-[80px] rounded-lg p-1 text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50' ></textarea>
                
            </div>

            <div className='flex flex-col p-5 align-center justify-evenly w-[100%] text-black '>
                
                    <div className=''>Enter Amount </div>
                    <input type='number' className='bg-white block rounded-lg p-1 text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50' ></input>
                
            </div>

            <div className='flex p-5 align-center justify-center w-[100%] text-black '>
                
                <div className='border-r-2 pr-[10px] border-black'><input onChange={(e)=>setExpenseMonth(e.target.value)} className=' outline-none' type="month" id="start" name="start" min="2022-01" value={expenseMonth}/></div>
                <div className='ml-[10px]'><input onChange={(e)=>{setTime(e.target.value)}} type="time" id="appt" name="appt" value={time}></input></div>
            
            </div>


            <div className='flex w-[100%] justify-evenly mb-[20px] text-black mt-auto'>
                <div onClick={(e)=>{setCategory(null);setAddExpense(!addExpense)}} className='cursor-pointer'><i className="fa-solid fa-xmark"></i> Cancel</div>
                <div onClick={(e)=>{console.log("save")}} className='cursor-pointer'><i className="fa-solid fa-check"></i> Save</div>
            </div>
        </div>
    </div>
  )
}
