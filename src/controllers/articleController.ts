import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { ArticleModel, CreateArticleData } from '../models/Article';

interface AuthRequest extends Request {
  userId?: number;
}

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

export { upload };

export class ArticleController {
  static async create(req: Request, res: Response) {
    try {
      const { title, content, author_id } = req.body;
      
      if (!author_id) {
        return res.status(400).json({ error: 'ID do autor é obrigatório' });
      }

      // Verificar se o usuário existe
      const { UserModel } = await import('../models/User');
      const user = await UserModel.findById(parseInt(author_id));
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      const banner_url = req.file ? `/uploads/${req.file.filename}` : undefined;

      const articleData: CreateArticleData = {
        title,
        content,
        author_id: parseInt(author_id),
        banner_url
      };

      const article = await ArticleModel.create(articleData);
      
      res.status(201).json({
        message: 'Artigo criado com sucesso',
        article
      });
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      let articles;
      
      if (search) {
        articles = await ArticleModel.searchByTitle(search as string);
      } else {
        articles = await ArticleModel.findAll();
      }

      // Paginação simples
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedArticles = articles.slice(startIndex, endIndex);

      res.json({
        articles: paginatedArticles,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(articles.length / Number(limit)),
          totalArticles: articles.length,
          hasNext: endIndex < articles.length,
          hasPrev: Number(page) > 1
        }
      });
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const articleId = parseInt(id);

      if (isNaN(articleId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const article = await ArticleModel.findByIdWithAuthor(articleId);
      if (!article) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      res.json(article);
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getByAuthor(req: Request, res: Response) {
    try {
      const { authorId } = req.params;
      const id = parseInt(authorId);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID do autor inválido' });
      }

      const articles = await ArticleModel.findByAuthor(id);
      res.json(articles);
    } catch (error) {
      console.error('Erro ao buscar artigos do autor:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getRecent(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const articles = await ArticleModel.getRecent(Number(limit));
      res.json(articles);
    } catch (error) {
      console.error('Erro ao buscar artigos recentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id, title, content, author_id } = req.body;

      // Validações básicas
      if (!id) {
        return res.status(400).json({ error: 'ID do artigo é obrigatório' });
      }

      if (!author_id) {
        return res.status(400).json({ error: 'ID do autor é obrigatório' });
      }

      const articleId = parseInt(id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: 'ID do artigo inválido' });
      }

      // Verificar se o artigo existe
      const existingArticle = await ArticleModel.findById(articleId);
      if (!existingArticle) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      // Verificar se o usuário é o autor
      if (existingArticle.author_id !== parseInt(author_id)) {
        return res.status(403).json({ error: 'Você só pode editar seus próprios artigos' });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (req.file) {
        updateData.banner_url = `/uploads/${req.file.filename}`;
      }

      // Verificar se há dados para atualizar
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi fornecido' });
      }

      // Atualizar o artigo
      const updatedArticle = await ArticleModel.update(articleId, updateData);
      
      if (!updatedArticle) {
        return res.status(500).json({ error: 'Erro ao atualizar artigo no banco de dados' });
      }

      res.json({
        message: 'Artigo atualizado com sucesso',
        article: updatedArticle
      });
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id, author_id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID do artigo é obrigatório' });
      }

      const articleId = parseInt(id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: 'ID do artigo inválido' });
      }

      if (!author_id) {
        return res.status(400).json({ error: 'ID do autor é obrigatório' });
      }

      // Verificar se o artigo existe e se o usuário é o autor
      const existingArticle = await ArticleModel.findById(articleId);
      if (!existingArticle) {
        return res.status(404).json({ error: 'Artigo não encontrado' });
      }

      if (existingArticle.author_id !== parseInt(author_id)) {
        return res.status(403).json({ error: 'Você só pode deletar seus próprios artigos' });
      }

      const deleted = await ArticleModel.delete(articleId);
      if (!deleted) {
        return res.status(500).json({ error: 'Erro ao deletar artigo' });
      }

      res.json({ message: 'Artigo deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getMyArticles(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const articles = await ArticleModel.findByAuthor(userId);
      res.json(articles);
    } catch (error) {
      console.error('Erro ao buscar meus artigos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
