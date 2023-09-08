import { Router } from 'express';
import authRouter from './auth.route'
import taskRouter from './task.route'
import userRouter from './user.route'

const router = Router();

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);
router.use('/users', userRouter);

export default router;