const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const PAGE_NOT_FOUND = 404;

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6410cdb64b99195afb3905a6',
  };

  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res) => {
  res.status(PAGE_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
