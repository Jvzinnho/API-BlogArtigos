import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';
import { validateUser, validateLogin, validateUpdateArticle } from '../middlewares/validation';

const router = Router();

// Rotas públicas
router.post('/register', validateUser, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

// Rotas protegidas (requerem autenticação)
router.get('/profile/me', authenticateToken, UserController.getProfile);
router.put('/profile/me', authenticateToken, validateUpdateArticle, UserController.updateProfile);

export default router;
