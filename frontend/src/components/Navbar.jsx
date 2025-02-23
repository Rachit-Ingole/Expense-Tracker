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
        title: 'Tax Calculator',
        path: '/tc',
        icon: <i className="fa-solid fa-calculator"></i>,
        cName: 'nav-text'
    },


];

export default function Navbar(props) {
    const {data, setData} = props
    const [sidebar, setSidebar] = useState(false);

    function logout(e) {
        setData(null)
    }

    return (
        <>
            <div
                className='z-50 text-black h-[80px] backdrop-blur-sm text-bold flex justify-between w-full backdrop-grayscale-[100%]'>
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

                <div className='mr-[30px] flex flex-col justify-center'>
                    <i className="fa-solid fa-circle-user text-4xl"></i>
                </div>
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
