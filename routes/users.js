const router = require('express').Router();
const {
  getUser,
  createUser,
  getUserId,
  updateUser,
  updateUserAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUser);

router.post('/signup', createUser);

router.post('/signin', login);

router.get('/:id', getUserId);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
