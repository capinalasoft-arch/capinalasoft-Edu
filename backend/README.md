# Capinalasoft Edu · Backend Core

Back-end responsável pelos domínios centrais do Capinalasoft Edu, construído em [NestJS 11](https://nestjs.com/) com foco em arquitetura modular, validação de ambiente forte e endpoints de observabilidade prontos para produção.

## Visão Rápida
- **Configuração reativa** via `@nestjs/config` + validação com `zod` (`src/config`).
- **Persistência** com Prisma + SQLite para desenvolvimento (migrável para PostgreSQL via `DATABASE_URL`).
- **Metadados do serviço** expostos em `GET /api` (nome, versão, ambiente, uptime).
- **Healthchecks padronizados** em `GET /api/health/live` e `GET /api/health/ready` (Terminus).
- **Módulos de domínio desacoplados** começando por `InstitutionsModule` (`src/modules/institutions`).

## Estrutura de Pastas
```
src/
  config/             # appConfig + validação de variáveis
  core/health/        # módulo de health e indicadores
  database/           # PrismaService (shared datasource)
  modules/**          # domínios (ex.: institutions)
  app.module.ts       # composição dos módulos globais
  main.ts             # bootstrap com prefixo global e pipes
prisma/
  schema.prisma       # modelo + datasource
  migrations/         # versão do schema
```

## Pré-requisitos
- Node.js 22+
- pnpm 10+

## Setup Local
```bash
cp .env.example .env                # ajuste porta/prefixo/DB conforme necessário
pnpm install                       # instala dependências
pnpm prisma migrate dev --name dev # cria banco local (sqlite por padrão)
pnpm run start:dev                 # sobe API em http://localhost:3000/api
```

> O prefixo padrão `API_GLOBAL_PREFIX=api` é aplicado apenas quando o app roda via `main.ts`. Testes de unidade/E2E trabalham sem prefixo para simplificar asserções.

## Scripts Úteis
| Comando | Descrição |
| --- | --- |
| `pnpm run start` | modo produção local (`dist/`)
| `pnpm run start:dev` | modo watch com reload
| `pnpm run build` | compila TypeScript → `dist`
| `pnpm run lint` | ESLint + correções automáticas
| `pnpm run test` | testes unitários (Jest)
| `pnpm run test:e2e` | aplica migrações em `prisma/test.db` + testes e2e (Supertest)
| `pnpm run prisma:migrate` | roda `prisma migrate dev`
| `pnpm run prisma:deploy` | aplica migrações em ambiente remoto
| `pnpm run prisma:generate` | regenera o client

## Variáveis de Ambiente
| Variável | Default | Descrição |
| --- | --- | --- |
| `NODE_ENV` | `development` | ambiente lógico
| `API_PORT` | `3000` | porta HTTP
| `API_GLOBAL_PREFIX` | `api` | prefixo aplicado aos endpoints
| `API_ENABLE_SHUTDOWN_HOOKS` | `true` | registra hooks de desligamento gracioso
| `DATABASE_URL` | `file:./prisma/dev.db` | conexão do Prisma (troque para PostgreSQL em produção)

Todas as variáveis são validadas em tempo de boot; valores inválidos impedem o start e exibem os erros.

## Banco de Dados & Prisma
- Cliente `@prisma/client` gerado a partir de `prisma/schema.prisma`.
- O repositório usa SQLite local (`file:./prisma/dev.db`) para dev/test, mas basta apontar `DATABASE_URL` para PostgreSQL.
- Migrações ficam em `prisma/migrations`. Use `pnpm prisma:migrate` para evoluir o schema localmente e `pnpm prisma:deploy` antes de rodar em ambientes compartilhados.
- `pnpm test:e2e` aplica as migrações em `prisma/test.db` automaticamente e limpa os dados por teste via `PrismaClient`.

## Módulo `Institutions`
- Endpoints REST (`/institutions`) para criar/listar/detalhar/atualizar/desativar instituições.
- DTOs tipados com `class-validator` + normalização de código (`CODE` sempre upper-case).
- Repositório Prisma com soft delete (`deletedAt`) e filtro automático nos `find`.
- Teste E2E (`test/institutions.e2e-spec.ts`) garante o fluxo CRUD completo.

## Healthchecks e Observabilidade
- **Live**: `GET /api/health/live` retorna status simples + uptime.
- **Ready**: `GET /api/health/ready` usa Terminus e `AppHealthIndicator`, pronto para incluir verificações de banco, fila, cache etc.

## Próximos Passos
1. Criar módulos por contexto (por exemplo `src/modules/academic`).
2. Conectar providers reais no `HealthModule` (PostgreSQL, Redis, Kafka).
3. Adicionar camada de autenticação/authorization e middlewares cross-cutting.
4. Publicar contratos (REST/GraphQL) e testes de contrato (Pact/OpenAPI).

Contribuições internas devem seguir os padrões definidos em `docs/system_blueprint.md` e `docs/design_system_ci.md` na raiz do monorepo.
