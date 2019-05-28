require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const routes = require(`./routes`);
const port = process.env.PORT;

const app = express();
const baseUrl = '/api'

app.use(bodyParser.json());
app.use(cors());
app.use(`${baseUrl}/pageSpeed/`, routes.pageSpeedRoutes);
app.get('/', (req, res) => res.send('Welcome to GCC Pagespeed Insights WebApi...'))

app.listen(port, () => {
  console.log(`${new Date().toString()}: App listening on port ${port}!`)
});