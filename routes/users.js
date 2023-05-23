const router = require('express').Router();
const {
  getUser,
  createUser,
  getUserId,
  updateUser,
  updateUserAvatar,
  login,
  thisUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

router.get('/', auth, getUser);

router.get('/me', auth, thisUser);

router.post('/signup', createUser);

router.post('/signin', login);

router.get('/:id', auth, getUserId);

router.patch('/me', auth, updateUser);

router.patch('/me/avatar', auth, updateUserAvatar);

module.exports = router;
