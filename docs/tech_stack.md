# Stack Técnica Sugerida

## Visão Geral
- **Monorepo**: Turborepo + PNPM workspaces para gerenciar apps web, mobile, backend e pacotes compartilhados.
- **Linguagem Principal**: TypeScript full-stack para maximizar reuso e DX; Dart (Flutter) opcional para squads mobile.
- **Infraestrutura**: Kubernetes (AKS/EKS/GKE) com IaC em Terraform; ambientes dev/stage/prod separados.

## Front-end Web
- **Framework**: Next.js 15 (App Router, React Server Components) + TypeScript.
- **Styling**: Tailwind CSS + Radix UI + design tokens (Style Dictionary) exportados como CSS/JS.
- **Estado/Data**: React Query + Zustand (estado local), GraphQL Codegen, Zod para validações.
- **Internacionalização**: next-intl com namespaces por módulo.
- **Acessibilidade**: testing-library + axe-core e linting específico.
- **Build/Quality**: ESLint (flat config), Biome ou Prettier, Storybook para componentes, Playwright para e2e.

## Mobile
- **Plataforma**: Flutter 3.24 (Dart) para UI nativa multiplataforma; alternativa React Native Expo para squads JS.
- **State Management**: Riverpod/Bloc (Flutter) ou Zustand/Mobx (RN).
- **Offline-first**: Drift/Hive (Flutter) ou WatermelonDB (RN) com camada de sync custom.
- **CI/CD Mobile**: Codemagic ou Fastlane + GitHub Actions; distribuição interna via Firebase App Distribution.
- **Push & Device Services**: Firebase Cloud Messaging + APNs; uso de Firebase DeviceCheck / Google SafetyNet para segurança.

## Backend Core
- **Framework**: NestJS 11 com módulos independentes (Acadêmico, Financeiro, etc.).
- **Patterns**: Clean Architecture + DDD + CQRS; uso de Mediator para comandos/eventos.
- **API Layer**: GraphQL Federation + REST; Apollo Gateway e schema stitching para plugins.
- **ORM**: Prisma para produtividade, TypeORM para cenários que exigem recursos específicos.
- **Mensageria/Eventos**: Kafka (Confluent/Redpanda) para eventos de domínio; BullMQ/Redis para jobs.
- **Cache/Sessões**: Redis Cluster, TTL configurável, fallback em memória dev.
- **Search**: OpenSearch/Elastic para funcionalidades de busca e analytics operacionais.

## Dados & Analytics
- **DB Operacional**: PostgreSQL 16 com RLS multi-tenant, citus opcional para sharding.
- **Data Lake**: AWS S3 + Apache Iceberg; ingestão via Airbyte/Nifi.
- **Transformações**: dbt Core + Airflow/Prefect orquestrando pipelines.
- **BI Embedded**: Apache Superset/Metabase embed com single sign-on.
- **ML/MLOps**: Vertex AI ou SageMaker; feature store Feast; monitoramento EvidentlyAI.

## DevOps & Observabilidade
- **IaC**: Terraform + Terragrunt, módulos reutilizáveis por ambiente.
- **CI/CD**: GitHub Actions + reusable workflows; ArgoCD para deploy contínuo.
- **Contêineres**: Docker multi-stage, SBOM com Syft/Grype, assinatura Cosign.
- **Observabilidade**: OpenTelemetry (traces/metrics/logs) + Grafana/Loki/Tempo/Prometheus.
- **Feature Flags**: LaunchDarkly ou OpenFeature + Flagsmith self-hosted.
- **Security**: Snyk/Trivy scanning, Dependabot, secret scanning automatizado, vault HashiCorp.

## Plataforma de Plugins
- **Contratos**: gRPC/GraphQL para comunicação, Manifesto JSON com metadata e permissões.
- **Runtime**: suporte a Node containers e WebAssembly (WASI) para extensões seguras.
- **CLI**: `capinalasoft-cli` (based on oclif) para scaffold, publish, validate.

## Ferramentas de Produtividade
- **Gestão**: Linear ou Jira com integração GitHub.
- **Documentação**: Docusaurus + Notion/Confluence para docs operacionais.
- **Comunicação**: Slack/Teams com bots para deploy/alertas.
