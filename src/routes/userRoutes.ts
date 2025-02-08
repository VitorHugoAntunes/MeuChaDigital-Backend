import { Router } from 'express';
import { getAllUsers, getUserByEmail, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { createUserWrapper } from '../middlewares/userMiddleware';

const router = Router();

router.get('/', getAllUsers);
router.get('/email/:email', getUserByEmail);
router.get('/id/:id', getUserById);

router.post('/', createUserWrapper);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;