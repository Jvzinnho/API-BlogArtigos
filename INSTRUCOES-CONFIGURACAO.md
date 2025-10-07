# 🚀 Instruções para Configurar e Testar a API BlogArtigo

## 1️⃣ Configurar o Arquivo .env

Crie um arquivo `.env` na raiz do projeto com suas credenciais do MySQL:

```env
# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=blogartigo

# Configurações do Servidor
PORT=3000

# Chave secreta para JWT
JWT_SECRET=minha_chave_secreta_super_forte_123
```

## 2️⃣ Verificar se as Tabelas Existem

Certifique-se de que executou os comandos SQL no seu banco:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT NOT NULL,
  banner_url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3️⃣ Testar a Conexão com o Banco

Execute o script de teste:

```bash
node test-db-connection.js
```

Este script irá:
- ✅ Verificar se as variáveis de ambiente estão configuradas
- ✅ Testar a conexão com o banco
- ✅ Verificar se as tabelas existem
- ✅ Executar uma query de teste

## 4️⃣ Testar a API Completa

Execute o script de teste completo:

```bash
node test-api.js
```

Este script irá:
- ✅ Criar um usuário de teste
- ✅ Buscar o usuário criado
- ✅ Criar um artigo de teste
- ✅ Buscar o artigo com dados do autor
- ✅ Listar todos os artigos
- ✅ Limpar os dados de teste

## 5️⃣ Iniciar o Servidor

Se todos os testes passaram, inicie o servidor:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 6️⃣ Testar os Endpoints

### Criar Usuário:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Fazer Login:
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Criar Artigo (use o token retornado no login):
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Meu Primeiro Artigo",
    "content": "Conteúdo do artigo aqui..."
  }'
```

### Listar Artigos:
```bash
curl http://localhost:3000/api/articles
```

## 🔧 Solução de Problemas

### Erro de Conexão:
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados existe

### Erro de Tabela:
- Execute os comandos SQL para criar as tabelas
- Verifique se as tabelas foram criadas corretamente

### Erro de Permissão:
- Verifique se o usuário MySQL tem permissões para acessar o banco
- Confirme se o usuário pode criar tabelas e inserir dados

## 📱 Próximos Passos

1. ✅ Configure o arquivo `.env`
2. ✅ Execute os scripts de teste
3. ✅ Inicie o servidor
4. ✅ Teste os endpoints
5. ✅ Integre com seu frontend @blog-artigo

## 🎯 Endpoints Disponíveis

### Usuários:
- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile/me` - Meu perfil (autenticado)
- `PUT /api/users/profile/me` - Atualizar perfil (autenticado)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID

### Artigos:
- `POST /api/articles` - Criar artigo (autenticado)
- `GET /api/articles` - Listar artigos
- `GET /api/articles/:id` - Buscar artigo por ID
- `PUT /api/articles/:id` - Atualizar artigo (autenticado, apenas autor)
- `DELETE /api/articles/:id` - Deletar artigo (autenticado, apenas autor)
- `GET /api/articles/my/articles` - Meus artigos (autenticado)
- `GET /api/articles/author/:authorId` - Artigos por autor
- `GET /api/articles/recent` - Artigos recentes
- `GET /api/articles/search?search=termo` - Buscar artigos

A API está pronta para ser consumida pelo seu frontend! 🚀
