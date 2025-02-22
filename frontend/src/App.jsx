import { useState } from 'react'
import Auth from './components/Auth'

function App() {
  const [data,setData] = useState(null)
  return (
    data ?
    <>
      Logged in!
    </>
    :
    <Auth setData={setData} /> 
  )
}

export default App
