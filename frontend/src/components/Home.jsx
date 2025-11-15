

const Button = () => {
  return (
    <button onClick={() => alert('Clicked')} >Click me</button>
  )
}

const Home = () => {
  return (
    <div><Button /></div>
    
  )
}

export default Home