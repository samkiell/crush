async function testApi() {
  const roomId = '692b478e6300e303444513bf';
  
  // Test 1: GET Rooms
  console.log('Testing GET /api/chat/rooms');
  try {
    const res1 = await fetch('http://localhost:3000/api/chat/rooms');
    console.log(`GET Rooms Status: ${res1.status}`);
  } catch (e) {
    console.log('GET Rooms Failed', e.message);
  }

  // Test 2: POST Join
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
