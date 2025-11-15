

const Copy = () => {

  const copyHandler = () => alert('Stop Copying my content');

  return (
    <h1 onMouseMove={copyHandler}>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam quibusdam labore et odit sunt error repudiandae blanditiis non consectetur accusantium consequuntur qui, sit quo minus impedit rerum ipsa necessitatibus eius.  
    </h1>
  )
}

const Home = () => {
  return (
    <div>
      <Copy />
    </div>
    
  )
}

export default Home