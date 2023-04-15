const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PAGE_NOT_FOUND } = require('./error/error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Слишком много запросов с этого IP-адреса',
});

app.use(limiter);

app.use(helmet());

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
