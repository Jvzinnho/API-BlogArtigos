import { Router } from 'express';
import { ArticleController, upload } from '../controllers/articleController';
import { authenticateToken } from '../middlewares/auth';
import { validateArticle, validateUpdateArticle } from '../middlewares/validation';

const router = Router();

// Rotas públicas
router.get('/', ArticleController.getAll);
router.get('/recent', ArticleController.getRecent);
router.get('/search', ArticleController.getAll); // Busca usando query parameter
router.get('/author/:authorId', ArticleController.getByAuthor);
router.get('/:id', ArticleController.getById);

// Rotas protegidas (requerem autenticação)
router.post('/', authenticateToken, upload.single('banner'), validateArticle, ArticleController.create);
router.put('/:id', authenticateToken, upload.single('banner'), validateUpdateArticle, ArticleController.update);
router.delete('/:id', authenticateToken, ArticleController.delete);
router.get('/my/articles', authenticateToken, ArticleController.getMyArticles);

export default router;
