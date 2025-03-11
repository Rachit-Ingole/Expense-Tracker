import {useEffect, useState} from 'react'
import Auth from './components/Auth'
import Main from './components/Main'

function App() {
    const [data, setData] = useState()

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
    },[])

    return (
        data ?
            <Main data={data} setData={setData}/>
            :
            <Auth setData={setData}/>
    )
}

export default App
