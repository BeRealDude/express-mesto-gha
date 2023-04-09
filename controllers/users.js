const User = require('../models/user');

const INCORRECT_DATA = 400;
const PAGE_NOT_FOUND = 404;
const DEFAULT_ERROR = 500;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectDataError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectDataError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'NotFound') {
        return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectDataError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'NotFound') {
        return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};
