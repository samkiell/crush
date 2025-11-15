import Home from './components/Home'
import Navbar from './components/Navbar'




const App = () => {
  return (
      <div style= {{  
        backgroundColor: 'purple', color: 'white', minHeight: '100vh', padding: '20px', margin: -12 
        }} > 
       <Navbar />
       <Home />
      </div>
  )
}





export default App