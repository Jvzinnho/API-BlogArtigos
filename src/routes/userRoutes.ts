import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';
import { validateUser, validateLogin, validateUpdateArticle, validateProfileUpdate } from '../middlewares/validation';

const router = Router();


router.post('/register', validateUser, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.get('/', authenticateToken, UserController.getAllUsers);
router.get('/profile', authenticateToken, UserController.getProfile);
router.get('/:id', UserController.getUserById);


router.put('/updateProfile', authenticateToken, validateProfileUpdate, UserController.updateProfile);

export default router;
