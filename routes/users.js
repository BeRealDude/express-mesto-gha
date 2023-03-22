const router = require('express').Router();
const {
  getUser,
  createUser,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUser);

router.get('/:id', getUserId);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
