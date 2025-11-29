import fetch from 'node-fetch';

async function testApi() {
  const roomId = '692b478e6300e303444513bf';
  const url = `http://localhost:3000/api/chat/rooms/${roomId}/join`;
  
  console.log(`Testing POST ${url}`);
  
  try {
    // We need a valid token to test this, but let's see if we get 401 (Unauthorized) or 404 (Not Found)
    // If we get 401, it means the route exists and is running.
    // If we get 404, it means the route is not found.
    
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
