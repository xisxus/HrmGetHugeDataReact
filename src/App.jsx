import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MachineData from './component/MachineData'
import MachineData2 from './component/MachineData2'
import Shefain1 from './component/Shefain1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <MachineData/> */}
        <MachineData2/>
        <Shefain1/>
        
      </div>
    </>
  )
}

export default App
