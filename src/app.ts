import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // servir imagens

// Rota principal
app.get('/', (req, res) => res.send('API BlogArtigo rodando 🚀'));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
    }
  }
  
  if (err.message === 'Apenas imagens são permitidas') {
    return res.status(400).json({ error: err.message });
  }
  
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
