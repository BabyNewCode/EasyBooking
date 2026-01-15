const fetch = require('node-fetch');

async function testRegister() {
  const url = 'http://localhost:5000/api/auth/register';
  const data = {
    username: 'testuser789',
    email: 'test789@example.com',
    password: 'password123',
    passwordConfirm: 'password123'
  };

  try {
    console.log('📤 Envoi de la requête d\'inscription...');
    console.log('URL:', url);
    console.log('Data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log('\n✅ Réponse reçue');
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(responseData, null, 2));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testRegister();
