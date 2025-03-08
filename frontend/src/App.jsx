import {useState} from 'react'
import Auth from './components/Auth'
import Main from './components/Main'

function App() {
    const [data, setData] = useState({username: 'Rachit', email_address: 'r@sexy.com', password: 'rachit'})
    return (
        data ?
            <Main data={data} setData={setData}/>
            :
            <Auth setData={setData}/>
    )
}

export default App
