/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import PesangonCalculator from './assets/components/PesangonCalculator'
import Navbar from './assets/components/Navbar'
import Footer from './assets/components/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col min-h-screen bg-red-800">
        <div className="absolute top-20 left-1/2 rounded-full bg-gradient-to-tr from-red-700 to-red-400 w-56 h-56"></div>
        <div className="absolute bottom-1/3 left-2 sm:left-12 rounded-full bg-gradient-to-tr from-red-700 to-red-400 w-28 h-28"></div>
        <div className="absolute bottom-0 right-1 sm:right-6 rounded-full bg-gradient-to-tr from-red-700 to-red-400 w-80 h-80"></div>
        <div className="absolute bottom-28 left-1/4 rounded-full bg-gradient-to-tr from-red-700 to-red-400 w-36 h-36"></div>
        <Navbar />
        <PesangonCalculator />
        <Footer />
      </div>
    </>
  )
}

export default App
