import app from './app';
import { testConnection } from './models/db';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📊 API disponível em: http://localhost:${PORT}`);
      });
    } else {
      console.error('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
