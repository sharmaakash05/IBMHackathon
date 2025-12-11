const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
const taskRoutes = require('./router');


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
const API_KEY = 'kIpXGhM2tFx01uJg5zaBB9e0boONsGFlVQ2VJGIEJQBG';

app.get('/api/token', async (req, res) => {
  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`
  });
  const data = await response.json();
  res.json({ access_token: data.access_token });
});

app.use('/', taskRoutes);
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function (body) {
    console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.originalUrl}:`, JSON.stringify(body));
    return oldJson.call(this, body);
  };
  next();
});
app.listen(3001, () => console.log('Token server running on port 3001'));
// app.listen(3001, '172.31.0.170', () => console.log('Token server running on 172.31.0.170:3001'));