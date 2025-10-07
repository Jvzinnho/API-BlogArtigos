import { pool } from './db';

export interface Article {
  id?: number;
  title: string;
  content: string;
  author_id: number;
  banner_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ArticleWithAuthor extends Article {
  author_name?: string;
  author_email?: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  author_id: number;
  banner_url?: string;
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  banner_url?: string;
}

export class ArticleModel {
  static async create(articleData: CreateArticleData): Promise<Article> {
    const { title, content, author_id, banner_url } = articleData;
    const [result] = await pool.execute(
      'INSERT INTO articles (title, content, author_id, banner_url) VALUES (?, ?, ?, ?)',
      [title, content, author_id, banner_url]
    );
    
    const insertResult = result as any;
    const article = await this.findById(insertResult.insertId);
    if (!article) {
      throw new Error('Falha ao criar artigo');
    }
    return article;
  }

  static async findById(id: number): Promise<Article | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    
    const articles = rows as Article[];
    return articles.length > 0 ? articles[0] : null;
  }

  static async findByIdWithAuthor(id: number): Promise<ArticleWithAuthor | null> {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name, u.email as author_email 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       WHERE a.id = ?`,
      [id]
    );
    
    const articles = rows as ArticleWithAuthor[];
    return articles.length > 0 ? articles[0] : null;
  }

  static async findAll(): Promise<ArticleWithAuthor[]> {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name, u.email as author_email 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       ORDER BY a.created_at DESC`
    );
    
    return rows as ArticleWithAuthor[];
  }

  static async findByAuthor(authorId: number): Promise<ArticleWithAuthor[]> {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name, u.email as author_email 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       WHERE a.author_id = ? 
       ORDER BY a.created_at DESC`,
      [authorId]
    );
    
    return rows as ArticleWithAuthor[];
  }

  static async update(id: number, articleData: UpdateArticleData): Promise<Article | null> {
    const fields = [];
    const values = [];

    if (articleData.title) {
      fields.push('title = ?');
      values.push(articleData.title);
    }

    if (articleData.content) {
      fields.push('content = ?');
      values.push(articleData.content);
    }

    if (articleData.banner_url !== undefined) {
      fields.push('banner_url = ?');
      values.push(articleData.banner_url);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM articles WHERE id = ?',
      [id]
    );
    
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  static async searchByTitle(searchTerm: string): Promise<ArticleWithAuthor[]> {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name, u.email as author_email 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       WHERE a.title LIKE ? 
       ORDER BY a.created_at DESC`,
      [`%${searchTerm}%`]
    );
    
    return rows as ArticleWithAuthor[];
  }

  static async getRecent(limit: number = 10): Promise<ArticleWithAuthor[]> {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name, u.email as author_email 
       FROM articles a 
       JOIN users u ON a.author_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    
    return rows as ArticleWithAuthor[];
  }
}
