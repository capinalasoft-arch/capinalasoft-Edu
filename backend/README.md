# Capinalasoft Edu · Backend Core

Back-end responsável pelos domínios centrais do Capinalasoft Edu, construído em [NestJS 11](https://nestjs.com/) com foco em arquitetura modular, validação de ambiente forte e endpoints de observabilidade prontos para produção.

## Visão Rápida
- **Configuração reativa** via `@nestjs/config` + validação com `zod` (`src/config`).
- **Metadados do serviço** expostos em `GET /api` (nome, versão, ambiente, uptime).
- **Healthchecks padronizados** em `GET /api/health/live` e `GET /api/health/ready` (Terminus).
- Base pronta para adicionar módulos de domínio (`src/core`, `src/modules`, `src/plugins`).

## Estrutura de Pastas
```
src/
  config/             # appConfig + validação de variáveis
  core/health/        # módulo de health e indicadores
  app.module.ts       # composição dos módulos globais
  main.ts             # bootstrap com prefixo global e pipes
```

## Pré-requisitos
- Node.js 22+
- pnpm 10+

## Setup Local
```bash
cp .env.example .env         # ajuste portas e prefixo se necessário
pnpm install                 # instala dependências
pnpm run start:dev           # sobe API em http://localhost:3000/api
```

> O prefixo padrão `API_GLOBAL_PREFIX=api` é aplicado apenas quando o app é iniciado via `main.ts`. Nos testes ele permanece sem prefixo para manter asserções simples.

## Scripts Úteis
| Comando | Descrição |
| --- | --- |
| `pnpm run start` | modo produção local (`dist/`)
| `pnpm run start:dev` | modo watch com reload
| `pnpm run build` | compila TypeScript → `dist`
| `pnpm run lint` | ESLint + correções automáticas
| `pnpm run test` | testes unitários (Jest)
| `pnpm run test:e2e` | testes end-to-end (Supertest)

## Variáveis de Ambiente
| Variável | Default | Descrição |
| --- | --- | --- |
| `NODE_ENV` | `development` | ambiente lógico
| `API_PORT` | `3000` | porta HTTP
| `API_GLOBAL_PREFIX` | `api` | prefixo aplicado aos endpoints
| `API_ENABLE_SHUTDOWN_HOOKS` | `true` | registra hooks de desligamento gracioso

Todas as variáveis são validadas em tempo de boot; valores inválidos impedem o start e exibem os erros.

## Healthchecks e Observabilidade
- **Live**: `GET /api/health/live` retorna status simples + uptime.
- **Ready**: `GET /api/health/ready` usa Terminus e `AppHealthIndicator`, pronto para incluir verificações de banco, fila, cache etc.

## Próximos Passos
1. Criar módulos por contexto (por exemplo `src/modules/academic`).
2. Conectar providers reais no `HealthModule` (PostgreSQL, Redis, Kafka).
3. Adicionar camada de autenticação/authorization e middlewares cross-cutting.
4. Publicar contratos (REST/GraphQL) e testes de contrato (Pact/OpenAPI).

Contribuições internas devem seguir os padrões definidos em `docs/system_blueprint.md` e `docs/design_system_ci.md` na raiz do monorepo.
