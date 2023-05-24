const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const routerSignup = require('./routes/signup');
const routerSignin = require('./routes/signin');

const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { errorCenter } = require('./middlewares/error-center');

const { PAGE_NOT_FOUND } = require('./error/error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

const limiter = rateLimit({
  max: 10000, // Перед сдачей исправить на 200!!!
  windowMs: 60 * 60 * 1000,
  message: 'Слишком много запросов с этого IP-адреса',
});

app.use(limiter);

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/', routerSignup);
app.use('/', routerSignin);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res) => {
  res.status(PAGE_NOT_FOUND).send({ message: 'Страница не найдена' });
});
app.use(errors());
app.use(errorCenter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
