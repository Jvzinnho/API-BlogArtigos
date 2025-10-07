import { Router } from 'express';
import { ArticleController, upload } from '../controllers/articleController';
import { authenticateToken } from '../middlewares/auth';
import { validateArticle, validateUpdateArticle } from '../middlewares/validation';

const router = Router();

// Rotas de operações (devem vir antes das rotas com parâmetros)
router.post('/', upload.single('banner'), validateArticle, ArticleController.create);
router.put('/edit', validateUpdateArticle, ArticleController.update);
router.delete('/remove', ArticleController.delete);
router.get('/my/articles', authenticateToken, ArticleController.getMyArticles);

// Rotas públicas
router.get('/', ArticleController.getAll);
router.get('/recent', ArticleController.getRecent);
router.get('/search', ArticleController.getAll); // Busca usando query parameter
router.get('/author/:authorId', ArticleController.getByAuthor);
router.get('/:id', ArticleController.getById);

export default router;
