import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: email, password' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Email inválido' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: email, password' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Email inválido' 
    });
  }

  next();
};

export const validateArticle = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, author_id } = req.body;

  if (!title || !content || !author_id) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: title, content, author_id' 
    });
  }

  if (title.length < 5) {
    return res.status(400).json({ 
      error: 'Título deve ter pelo menos 5 caracteres' 
    });
  }

  if (content.length < 50) {
    return res.status(400).json({ 
      error: 'Conteúdo deve ter pelo menos 50 caracteres' 
    });
  }

  const authorIdNum = parseInt(author_id);
  if (isNaN(authorIdNum) || authorIdNum <= 0) {
    return res.status(400).json({ 
      error: 'author_id deve ser um número válido' 
    });
  }

  next();
};

export const validateUpdateArticle = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  if (title !== undefined && title.length < 5) {
    return res.status(400).json({ 
      error: 'Título deve ter pelo menos 5 caracteres' 
    });
  }

  if (content !== undefined && content.length < 50) {
    return res.status(400).json({ 
      error: 'Conteúdo deve ter pelo menos 50 caracteres' 
    });
  }

  next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (name !== undefined) {
    if (name.length < 2) {
      return res.status(400).json({ 
        error: 'Nome deve ter pelo menos 2 caracteres' 
      });
    }
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Email inválido' 
      });
    }
  }

  if (password !== undefined && password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }

  next();
};
