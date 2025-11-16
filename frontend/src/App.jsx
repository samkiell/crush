import { Routes, Route, Link, Outlet } from 'react-router-dom'

import Home from './components/Home'
import Navbar from './components/Navbar'
import './index.css'



const App = () => {
  return (
      <div>

       <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/same" element={<Home />} />
          <Route path="*" element={<h2>404 - Not found</h2>} />
        </Routes>

      </div>
  )
}





export default App