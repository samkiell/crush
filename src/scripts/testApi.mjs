async function testApi() {
  const roomId = '692b478e6300e303444513bf';
  const url = `http://localhost:3000/api/chat/rooms/${roomId}/join`;
  
  console.log(`Testing POST ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log(`Body: ${text}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
