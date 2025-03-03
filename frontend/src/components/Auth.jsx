import React, { useState,useEffect } from 'react'

const api_url = "http://127.0.0.1:8000/api/v1/auth/";

export default function Auth(props) {
  const {setData} = props
  const [page,setPage] = useState("home")
  const [error,setError] = useState("")
  const [email,setEmail] = useState("")
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  function resetData(){
    setEmail("");
    setUsername("");
    setPassword("");
    setError("")
  }
  function handleLogin(e){
    if( !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
      setError("Email is invalid")
      return
    }
    
    if(password.length < 6){
      setError("Invalid Credentials")
      return
    }
    setError("")
    async function login() {
      try{
        const API_URL = `${api_url}login`
        const {data:actualData}  = await axios.post(API_URL,{"email_address":email,"password":password})
        console.log(actualData)
        setData(actualData)


        
      }catch(err){
        setError("Invalid Credentials")
        console.error(err)
      }
    }

    login()

  }

  function handleRegister(e){
    if( !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
      setError("Email is invalid")
      return
    }
    if(username.length >= 50){
      console.log(username.length)
      setError("Username is too long")
      return
    }
    if(password.length < 6){
      setError("Password length must be greater than 6")
      return
    }
    setError("")
    async function register() {
      try{
        const API_URL = `${api_url}register`
        const {data:actualData}  = await axios.post(API_URL,{"username":username,"email_address":email,"password":password})
        console.log(actualData)
        setData(actualData)
      }catch(err){
        setError("Email already exists")
        console.error(err)
      }
    }

    register()

  }



  

  return (
    page == "home" ? 
    <div className='w-screen h-screen text-black ' >
      <div className='h-[90px] flex items-center justify-center w-full'>
      <h1 className='text-4xl font-Mont font-md w-[85%]'>Penny<span className='text-blue-500'>Wise</span></h1>
      </div>
      <div className=' flex h-[600px] w-[85%] m-auto'>
        <div className='flex flex-col lg:w-1/2 justify-center gap-[20px]'>
          <h1 className='text-4xl font-Mont  font-semibold'>Expense <span className='text-blue-500'>Tracking</span>  App</h1>
          <p className='text-lg font-Poppins'>Master your money with our Expense Tracker! Quickly log expenses, set budgets, and see where your money goes with insightful charts. Start saving smarter today!</p>
          <button onClick={(e)=>setPage("login")} className='w-[200px] cursor-pointer font-Poppins bg-blue-500 text-white pt-2 pb-2 pl-1 pr-1 rounded-lg font-semibold'>
            Login/Register
          </button>
        </div>
        <div className='hidden lg:inline lg:w-1/2 flex justify-center items-center p-20'>
          <img src='/trainers.png'></img>
        </div>

      </div>
    </div>
    :
    (page == "login" ? 
      <div className='w-screen h-screen bg-transparent text-white flex justify-center '  onKeyDown={(e)=>{if(e.key == "Enter"){handleLogin(e)}}}>
      <div className='auth-page flex w-screen justify-center align-center items-center text-white '>
        
        <div className='w-[400px] h-[500px] bg-slate-800 rounded-xl flex flex-col justify-center gap-[20px] border-t-4 border-blue-400 '>
          <div className='mx-auto text-2xl sm:text-4xl mt-[10px]'>
            <h1 className='font-Mont font-semibold mt-[10px]'>PennyWise</h1>
          </div>
          <div className='mx-auto  text-xl sm:text-2xl  '>
            <h1 className='font-Mont'>Login</h1>
          </div>
          <div className='flex flex-col justify-evenly h-1/2 items-center mb-[20px]'>
            <div className='mx-auto text-xl sm:text-2xl w-3/4'>
              <h1 className='font-Poppins text-xl'>Email:</h1>
              <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className='w-full pl-1 h-[30px] text-lg rounded-md text-slate-800 bg-white focus:outline-none'></input>
            </div>
            <div className='mx-auto text-xl sm:text-2xl w-3/4'>
              <h1 className='font-Poppins text-xl'>Password:</h1>
              <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type='password' className='w-full pl-1 h-[30px] text-lg rounded-md bg-white text-slate-800 focus:outline-none'></input>
            </div>
          </div>
          <div className='mx-auto alert box'>
            <h1 className='text-red-400'>{error}</h1>
          </div>
          <div className='mx-auto  text-lg sm:text-xl   w-full flex justify-center '>
            <button onClick={(e)=>handleLogin(e)} className='font-Mont bg-blue-400 py-1 w-1/2 rounded-lg duration-700 hover:bg-blue-600'>Submit</button>
          </div>
          <div className='mx-auto  text-sm  '>
            <h1 className='font-Mont mt-[-10px] mb-[20px]'>Not a member yet? <span className='cursor-pointer text-blue-400 underline' onClick={(e)=>{resetData();setPage("register")}}>Register</span></h1>
          </div>
        </div>
      </div>
    </div>     
      :
    <div className='w-screen h-screen text-white flex justify-center' onKeyDown={(e)=>{if(e.key == "Enter"){handleRegister(e)}}}>
      <div className='auth-page flex w-screen justify-center align-center items-center text-white '>
        
        <div className='w-[400px] h-[500px] bg-slate-800 rounded-xl flex flex-col justify-center gap-[20px] border-t-4 border-blue-400 '>
          <div className='mx-auto text-2xl sm:text-4xl mt-[10px]'>
            <h1 className='font-Mont font-semibold mt-[10px]'>PennyWise</h1>
          </div>
          <div className='mx-auto  text-xl sm:text-2xl  '>
            <h1 className='font-Mont'>Register</h1>
          </div>
          <div className='flex flex-col justify-evenly h-1/2 items-center mb-[20px]'>
            <div className='mx-auto text-xl sm:text-2xl w-3/4'>
              <h1 className='font-Poppins text-xl'>Username:</h1>
              <input value={username} onChange={(e)=>{setUsername(e.target.value)}} className='bg-white w-full pl-1 h-[30px] text-lg rounded-md text-slate-800 focus:outline-none'></input>
            </div>
            <div className='mx-auto text-xl sm:text-2xl w-3/4'>
              <h1 className='font-Poppins text-xl'>Email:</h1>
              <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className='bg-white w-full pl-1 h-[30px] text-lg rounded-md text-slate-800 focus:outline-none'></input>
            </div>
            <div className='mx-auto text-xl sm:text-2xl w-3/4'>
              <h1 className='font-Poppins text-xl'>Password:</h1>
              <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type='password' className='bg-white w-full pl-1 h-[30px] text-lg rounded-md text-slate-800 focus:outline-none'></input>
            </div>
          </div>
          <div className='mx-auto alert box'>
            <h1 className='text-red-400'>{error}</h1>
          </div>
          <div className='mx-auto  text-lg sm:text-xl   w-full flex justify-center '>
            <button onClick={(e)=>handleRegister(e)} className='font-Mont bg-blue-400 py-1 w-1/2 rounded-lg duration-700 hover:bg-blue-600'>Submit</button>
          </div>
          <div className='mx-auto  text-sm  '>
            <h1 className='font-Mont mt-[-10px] mb-[20px]'>Already a member? <span className='cursor-pointer text-blue-400 underline' onClick={(e)=>{resetData();setPage("login")}}>Login</span></h1>
          </div>
        </div>
      </div>
    </div>
    )
  )
}
