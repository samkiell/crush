const Copy = () => {

const copyHandler = () => console.log("Stop Copying my content");

  return (
    <h1 onCopy={copyHandler}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam quibusdam labore et odit sunt error repudiandae blanditiis non consectetur accusantium consequuntur qui, sit quo minus impedit rerum ipsa necessitatibus eius.  </h1>
  )
}

export default Copy