const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserId,
  updateUser,
  updateUserAvatar,
  thisUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

router.get('/', auth, getUser);

router.get('/me', auth, thisUser);

router.get('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), getUserId);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), updateUserAvatar);

module.exports = router;
