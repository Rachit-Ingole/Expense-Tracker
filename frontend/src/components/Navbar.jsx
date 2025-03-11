import React, { useEffect, useReducer, useRef } from 'react'
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
    path: '/expense-analysis',
    icon: <i className="fa-solid fa-chart-simple"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Budgets',
    path:'/budgets',
    icon: <i className="fa-solid fa-calculator"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Currency Exchange',
    path: '/currency-exchange',
    icon: <i className="fa-solid fa-coins"></i>,
    cName: 'nav-text'
  },
  {
    title: 'Email Reminder',
    path: '/email-reminder',
    icon: <i className="fa-solid fa-clock"></i>,
    cName: 'nav-text'
  },
];

export default function Navbar(props) {
    const {data, setData} = props
    const [sidebar, setSidebar] = useState(false);
    const [userIconClicked,setUserIconClicked] = useState(false);
    const [changePassword,setChangePassword] = useState(false);
    const [passwordData,setPasswordData] = useState({currentPassword:"",newPassword:"",newPassword2:""});
    const [newUsername,setNewUsername] = useState(data.username)
    const [error,setError] = useState("")
    const [usernameEditable,setUsernameEditable] = useState(false)
    const userRef = useRef(null)
    
    const [showPassword,setShowPassword] = useState(false)

    function logout() {
        localStorage.removeItem('userData')
        setData(null)
    }

    function updatePassword(){
        
        if(!passwordData.currentPassword || !passwordData.newPassword || !passwordData.newPassword2){
            setError("Please provide all values")
            return;
        }

        if(passwordData.newPassword != passwordData.newPassword2){
            setError("Password don't match")
            return;
        }

        if(passwordData.currentPassword != data.password){
            setError("Wrong password")
            return;
        }

        if(passwordData.currentPassword == passwordData.newPassword){
            setError("Cannot set the same password")
            return;
        }

        async function updatePasswordInDatabase() {
            try{
                const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/changepassword`
                let newBody = {...data,'newPassword':passwordData.newPassword};
                const {data:actualData}  = await axios.patch(API_URL,newBody)
                setData(actualData)
                setError("Password Updated Succesfully")
              }catch(err){
                setError("Incorrect Password or Something went wrong") 
              }
        }
        updatePasswordInDatabase();
    }

    function changeUsername(){

        if(!newUsername || newUsername == data.username){
            setNewUsername(data.username);
            setUsernameEditable(false);
            return;
        }

        async function updateUsernameInDatabase() {
            try{
                const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/changeusername`
                let newBody = {...data,'newUsername':newUsername};
                const {data:actualData}  = await axios.patch(API_URL,newBody)
                setData(actualData)
                
              }catch(err){
                setError("Incorrect Password or Something went wrong") 
              }
        }
        updateUsernameInDatabase()

    }

    useEffect(()=>{
        if(usernameEditable){
            userRef.current.focus()
        }
    },[usernameEditable])

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

                <div className='cursor-pointer mr-[30px] flex flex-col justify-center' onClick={()=>{setUserIconClicked(!userIconClicked);setPasswordData({currentPassword:"",newPassword:"",newPassword2:""});setChangePassword(false)}}>
                    <i className="fa-solid fa-circle-user text-4xl"></i>
                </div>
                
            </div>
            <div className={userIconClicked ? 'z-60 select-none fixed top-15 p-5 text-white rounded-lg  right-10 w-[80%] sm:w-[400px] bg-slate-600 flex flex-col justify-center' : 'hidden' } >
                {changePassword ? 
                (<>
                <div>
                <h1 className='text-sm'>Current Password:</h1>
                <div className='text-lg bg-slate-900 py-1 rounded-lg w-full flex justify-between items-center focus:outline-blue-400 pr-3'>
                    <input type={showPassword ? "text" : "password"} className='w-[90%] text-md px-1 ' value={passwordData.currentPassword} onChange={(e)=>setPasswordData({...passwordData,currentPassword:e.target.value})}></input>
                    <i className={!showPassword ? "fa-solid fa-eye cursor-pointer" : "fa-solid fa-eye-slash cursor-pointer"} onClick={()=>{setShowPassword(!showPassword)}}></i>
                </div>
                </div>

                <div>
                <h1 className='text-sm'>New Password:</h1>
                <div className='text-lg bg-slate-900 py-1 rounded-lg w-full flex justify-between items-center'>
                    <input type='password' className='w-full text-md px-1' value={passwordData.newPassword} onChange={(e)=>setPasswordData({...passwordData,newPassword:e.target.value})}></input>
                    
                </div>
                </div>

                <div>
                <h1 className='text-sm'>New Password Again:</h1>
                <div className='text-lg bg-slate-900 py-1 rounded-lg w-full flex justify-between items-center'>
                    <input type='password' className='w-full text-md px-1' value={passwordData.newPassword2} onChange={(e)=>setPasswordData({...passwordData,newPassword2:e.target.value})}></input>
                    
                </div>
                </div>

                <div className='flex justify-center h-[30px]'>
                    <h1 className={error=='Password Updated Succesfully'? 'text-sm text-green-400 font-semibold':'text-sm text-red-400 font-semibold'}>{error}</h1>
                </div>
                
                <button className='cursor-pointer bg-slate-900 px-3 py-1 rounded-lg mt-auto hover:text-blue-500 transition duration-300 ease-in-out' onClick={()=>{updatePassword()}}>Update Password</button>
                </>) : 
                (<>
                <div className='mb-[20px]'>
                <h1 className='text-sm'>Username:</h1>
                <div className='text-lg pr-2 bg-slate-900 py-1 rounded-lg w-full flex justify-between items-center focus:outline-blue-400'>
                    <input ref={userRef} disabled={!usernameEditable} className='w-[90%] text-md px-1 ' value={newUsername} onChange={(e)=>setNewUsername(e.target.value)}></input>
                    {!usernameEditable ? 
                    <i onClick={()=>{setUsernameEditable(!usernameEditable)}} className="cursor-pointer fa-solid fa-pen-to-square hover:text-blue-500"></i>
                    :
                    <i onClick={()=>{changeUsername();}} className="cursor-pointer fa-solid fa-floppy-disk hover:text-blue-500"></i>
                    }
                </div>
                </div>
                <div className='mb-[20px]'>
                <h1 className='text-sm'>Email Address:</h1>
                <div className='text-lg pr-2 bg-slate-900 py-1 rounded-lg w-full flex justify-between items-center focus:outline-blue-400'>
                    <h1 className='w-[90%] text-md px-1 '>{data.email_address}</h1>
                </div>
                </div>
                <button className='cursor-pointer bg-slate-900 px-3 py-1 rounded-lg mt-auto hover:text-blue-500 transition duration-300 ease-in-out' onClick={()=>setChangePassword(!changePassword)}>Change Password</button>
                </>)
                }
            </div>
            <div onClick={()=>{setError("");setNewUsername(data.username);setUsernameEditable(false);setChangePassword(false);setPasswordData({currentPassword:"",newPassword:"",newPassword2:""});setUserIconClicked(false)}} className={userIconClicked ? "fixed w-[100vw] h-[100vh] top-0 left-0 bg-transparent z-40 opacity-[90%] " : "hidden"}>
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
            <div onClick={()=>{setSidebar(false)}} className={sidebar ? "fixed w-[100vw] h-[100vh] top-0 left-0 bg-transparent z-40 opacity-[90%] " : "hidden"}></div>
        </>
    )
}
