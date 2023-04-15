const User = require('../models/user');
const { INCORRECT_DATA, PAGE_NOT_FOUND, DEFAULT_ERROR } = require('../error/error');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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
