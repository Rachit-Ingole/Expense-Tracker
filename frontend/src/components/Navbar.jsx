import React from 'react'
import './Navbar.css';
import {Link} from 'react-router-dom';
import {useState} from 'react';

const SidebarData = [
  {
    title: 'Expense Tracker',
    path: '/',
    icon: <i className="fa-solid fa-wallet"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Expense Report',
    path: '/er',
    icon: <i className="fa-solid fa-chart-simple"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Currency Exchange',
    path: '/ce',
    icon: <i className="fa-solid fa-coins"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Email Reminder',
    path: '/er',
    icon: <i className="fa-solid fa-clock"></i>,
    cName: 'nav-text'
  },
];

export default function Navbar(props) {
    const {data, setData} = props
    const [sidebar, setSidebar] = useState(false);
    const [userIconClicked,setUserIconClicked] = useState(false);

    function logout(e) {
        setData(null)
    }

    return (
        <>
            <div
                className='text-black h-[80px] backdrop-blur-sm text-bold flex justify-between w-full backdrop-grayscale-[100%]'>
                <div className='ml-[30px] flex flex-col justify-center cursor-pointer'
                     onClick={() => (setSidebar(!sidebar))}> {/*LEFT NAVBAR */}
                    <i className="fa-solid fa-bars text-3xl"></i>
                </div>
                <div>
                    <div className='mt-[10px]'>
                        <h1 className='text-3xl font-semibold text-center'>Penny<span
                            className='font-semibold text-blue-500'>Wise</span></h1>
                        <h1 className='text-center'>Welcome, <span className='font-semibold'>{data.username}</span></h1>
                    </div>
                </div>

                <div className='cursor-pointer mr-[30px] flex flex-col justify-center' onClick={()=>setUserIconClicked(!userIconClicked)}>
                    <i className="fa-solid fa-circle-user text-4xl"></i>
                </div>
                
            </div>
            <div className={userIconClicked ? 'z-60 select-none fixed top-15 p-5 text-white rounded-lg  right-10 w-[80%] h-[200px] sm:w-[400px] sm:h-[200px] bg-slate-600 flex flex-col gap-[10px] justify-center ' : 'hidden' } >
                <div className='text-lg bg-slate-900 px-3 py-1 rounded-lg w-full flex justify-between items-center'>
                    <input className='w-[90%]' value={`Username: ${data.username}`}></input>
                    <i className="cursor-pointer fa-solid fa-pen-to-square hover:text-blue-500"></i>
                </div>
                <div className='text-lg bg-slate-900 px-3 py-1 rounded-lg w-full flex justify-between items-center'>
                    <input className='w-[90%]' value={`Email Address: ${data.email_address}`}></input>
                    <i className="cursor-pointer fa-solid fa-pen-to-square hover:text-blue-500"></i>
                </div>
                <button className='cursor-pointer bg-slate-900 px-3 py-1 rounded-lg mt-auto hover:text-blue-500 transition duration-300 ease-in-out'>Change Password</button>
            </div>
            <nav className={sidebar ? 'z-60 nav-menu active' : 'z-60 nav-menu'}>
                <ul className='nav-menu-items flex flex-col justify-between' onClick={() => (setSidebar(!sidebar))}>
                    <ul>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <i className="fa-solid fa-xmark"></i>
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <li className='menu-bars cursor-pointer mb-[20px]' onClick={() => {
                        logout()
                    }}>
                        <i className="fa-solid fa-right-from-bracket text-2xl"></i>
                        <span className='text-2xl'>Logout</span>
                    </li>
                </ul>
            </nav>
        </>
    )
}
