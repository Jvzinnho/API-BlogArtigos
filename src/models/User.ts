import { pool } from './db';

export interface User {
  id?: number;
  name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { name, email, password } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password]
    );
    
    const insertResult = result as any;
    const user = await this.findById(insertResult.insertId);
    if (!user) {
      throw new Error('Falha ao criar usuário');
    }
    return user;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async findAll(): Promise<User[]> {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    
    return rows as User[];
  }

  static async update(id: number, userData: UpdateUserData): Promise<User | null> {
    const fields = [];
    const values = [];

    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }

    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }

    if (userData.password) {
      fields.push('password_hash = ?');
      values.push(userData.password);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }
}
