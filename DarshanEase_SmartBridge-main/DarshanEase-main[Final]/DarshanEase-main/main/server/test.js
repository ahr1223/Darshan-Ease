const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email: 'user@example.com', password: 'password' });
    const token = loginRes.data.token;
    const bookingRes = await axios.get('http://localhost:5000/api/bookings/user', { headers: { Authorization: "Bearer " + token } });
    console.log(JSON.stringify(bookingRes.data, null, 2));
  } catch (err) {
    console.error(err.message, err.response?.data);
  }
}
test();
