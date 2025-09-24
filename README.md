# Safira - Gerenciador de Tarefas

Aplicação full-stack (Django REST Framework + React) para gerenciamento de projetos e tarefas.

## Estrutura
- `backend/` (Django + DRF)
- `core/` (app com models, serializers, views e urls)
- `frontend/` (Create React App)

## Requisitos
- Python 3.11+
- Node.js 18+
- MySQL 8 (ou compatível)

## Backend (Django)
1. Criar e ativar um ambiente virtual (opcional, mas recomendado)
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```
2. Instalar dependências
   ```bash
   pip install -r requirements.txt
   ```
3. Configurar banco de dados
   - O arquivo `backend/settings.py` está configurado para MySQL por padrão:
     - NAME: `safira`
     - USER: `safira`
     - PASSWORD: `admin`
     - HOST: `localhost`
     - PORT: `3306`
   - Crie o banco e o usuário, ou ajuste as credenciais conforme seu ambiente.
4. Rodar migrações e criar superusuário (opcional para acessar /admin)
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. Iniciar o servidor
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

Endpoints principais (prefixo `/api/`):
- `POST /api/auth/` (obter Token)
- `GET /api/health/` (status público)
- `GET/POST /api/projects/`
- `GET/POST /api/tasks/`
- `GET /api/users/` (somente admin)

Autenticação: adicionar header `Authorization: Token <SEU_TOKEN>`

## Frontend (React)
1. Instalar dependências
   ```bash
   cd frontend
   npm install
   ```
2. Ambiente de desenvolvimento
   - O `package.json` define `proxy: http://localhost:8000`.
   - O axios usa `baseURL` como `/api/` por padrão (`src/api/client.js`).
   - Opcional: copie `.env.example` para `.env` e ajuste `REACT_APP_API_BASE_URL` se não usar o proxy.
3. Rodar o frontend
   ```bash
   npm start
   ```

## Fluxo de Autenticação
- Acesse a aba "Login" no frontend.
- Informe usuário e senha. Em sucesso, o Token é salvo no `localStorage` como `authToken`.
- Todas as requisições passarão a incluir `Authorization: Token ...` automaticamente.

## Funcionalidades Mínimas (Demo)
- Projetos: criar, listar, editar, excluir e gerenciar membros (`add_user`, `remove_user`).
- Tarefas: criar, listar, editar, excluir; atualização rápida de `status` e `priority` na tabela.
- Usuários: listagem somente para admin.
- Validações de formulário e feedback de sucesso/erro no frontend.

## Dicas de Apresentação
- Use a aba "Status API" para checar conectividade (`/api/health/`).
- Crie um projeto, depois crie tarefas associadas a ele.
- Mostre o login gerando token via `/api/auth/` pela aba "Login".

## Problemas Comuns
- 401 Não autorizado: faça login no frontend para obter o token.
- Erro ao salvar tarefa: verifique se o `assigned_to` é membro do projeto (regra de negócio validada no backend).
- Banco de dados: confirme credenciais do MySQL ou ajuste `backend/settings.py`.
