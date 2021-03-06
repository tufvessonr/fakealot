import express from 'express';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/auth/users', async (req, res) => {
  const users = await User.find();

  res.status(200).send({ users });
});

export { router as usersRouter };

