import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React from 'react'

export default function CategoryDropper(props) {
    const {type,setCategory,category} = props


  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 ">
          {category ? category : "Select Category"}
          <i className="fa-solid mt-[4px] fa-angle-down"></i>
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