import React from 'react'
import './App.css'
import va from "./assets/ai.png"
import { FaMicrophone } from "react-icons/fa";


function App() {
  return (

    <div className='main'>

      <img src={va} alt="" id="deva" />
      <span> I'm Deva, Your Advanced Virtual Assistant</span>
      <button id="btn"><FaMicrophone /></button>
    </div>

  )
}

export default App