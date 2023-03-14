const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/users', routerUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
