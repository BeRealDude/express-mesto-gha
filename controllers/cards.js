const Card = require('../models/card');
const { INCORRECT_DATA, PAGE_NOT_FOUND, DEFAULT_ERROR } = require('../error/error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: idUser } = req.user;

  Card.create({ name, link, owner: idUser })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Указан некорректный id при удалении карточки.' });
      } else { res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: idUser } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: idUser } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: idUser } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: idUser } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      return res.status(PAGE_NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
    });
};
