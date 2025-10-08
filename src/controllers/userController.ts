import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel, CreateUserData } from '../models/User';
import { generateToken } from '../middlewares/auth';

interface AuthRequest extends Request {
  userId?: number;
}

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Verificar se o email já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Criar usuário (sem nome inicialmente)
      const userData: CreateUserData = {
        name: '', // Nome vazio inicialmente
        email,
        password: password_hash
      };

      const user = await UserModel.create(userData);

      // Gerar token
      const token = generateToken(user.id!);

      // Retornar dados do usuário (sem a senha) e token
      const { password_hash: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar usuário por email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = generateToken(user.id!);

      // Retornar dados do usuário (sem a senha) e token
      const { password_hash: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { password_hash: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { id, name, email, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'ID do usuário inválido' });
      }

      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) {
        const userWithEmail = await UserModel.findByEmail(email);
        if (userWithEmail && userWithEmail.id !== userId) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
        updateData.email = email;
      }
      if (password !== undefined) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi fornecido' });
      }

      const updatedUser = await UserModel.update(userId, updateData);
      if (!updatedUser) {
        return res.status(500).json({ error: 'Erro ao atualizar usuário no banco de dados' });
      }

      const { password_hash: _, ...userWithoutPassword } = updatedUser;
      
      res.json({
        message: 'Perfil atualizado com sucesso',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { password_hash: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
