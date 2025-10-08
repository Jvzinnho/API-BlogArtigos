import { Router } from 'express';
import { ArticleController, upload } from '../controllers/articleController';
import { authenticateToken } from '../middlewares/auth';
import { validateArticle, validateUpdateArticle } from '../middlewares/validation';

const router = Router();

router.post('/',authenticateToken, upload.single('banner'), validateArticle, ArticleController.create);
router.put('/edit', authenticateToken, validateUpdateArticle, ArticleController.update);
router.delete('/remove',authenticateToken, ArticleController.delete);
router.get('/my/articles', authenticateToken, ArticleController.getMyArticles);

router.get('/', ArticleController.getAll);
router.get('/recent', ArticleController.getRecent);
router.get('/author/:authorId', ArticleController.getByAuthor);
router.get('/:id', ArticleController.getById);

export default router;
