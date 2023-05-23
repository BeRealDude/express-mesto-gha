const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { INCORRECT_DATA, PAGE_NOT_FOUND, DEFAULT_ERROR } = require('../error/error');
const PageNotFound = require('../error/page-not-found');
const IncorrectData = require('../error/incorrect-data');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        console.log(err.name, 'blyt');
        next(new IncorrectData('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.thisUser = (req, res) => {
  const { _id: idUser } = req.user;
  User.findById(idUser)
    .then((user) => {
      if (user) return res.send({ user });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret');
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ email, token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, name, about, avatar,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};
