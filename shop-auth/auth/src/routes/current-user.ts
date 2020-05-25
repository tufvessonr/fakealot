import { currentUser } from '@sgtickets/common';
import express from 'express';

const router = express.Router();

router.get('/api/auth/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

