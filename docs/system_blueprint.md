# Sistema Modular de Gestão Escolar "Capinalasoft Edu"

## 1. Visão Geral e Objetivos
- Recriar o conjunto funcional do i-Educar (acadêmico, administrativo, relatórios e integrações) com foco em extensibilidade e experiência premium.
- Interface e UX inspiradas no WordPress moderno: dashboard configurável, temas, widgets, menu builder drag-and-drop, modo escuro, responsividade total.
- Núcleo modular com suporte a plugins, mantendo contratos estáveis (APIs, eventos, webhooks e hooks de UI) para que equipes terceiras estendam o produto sem tocar no core.
- Paridade web + mobile com apps avançados (Flutter/React Native) que funcionam offline-first, sincronização assíncrona e notificações push segmentadas.

## 2. Personas-chave
- **Secretarias escolares**: matrículas, documentos, relatórios oficiais.
- **Coordenadores pedagógicos**: currículos, avaliações, indicadores de aprendizagem.
- **Professores**: diário de classe, planos de aula, acompanhamento da turma.
- **Financeiro**: mensalidades, inadimplência, conciliação bancária, bolsas.
- **Responsáveis/Estudantes**: portal e app mobile com notas, frequência, pagamentos, comunicados.
- **Equipe de TI**: governança, integrações, observabilidade, publicação de plugins.

## 3. Conjunto de Módulos Avançados
### 3.1 Acadêmico & Pedagógico
1. **Cadastro Institucional**: escolas, calendários, etapas, componentes curriculares.
2. **Matrículas & Vagas Inteligentes**: workflow, listas de espera, migração entre unidades.
3. **Currículo & Competências (BNCC/IB/Custom)**: edição visual, versionamento, alinhamento a avaliações.
4. **Planejamento Pedagógico**: planos de aula colaborativos, biblioteca de recursos, integração com LMS externo.
5. **Avaliação, Notas e Frequência**: diários inteligentes, rubricas customizadas, coleta offline via app.
6. **Vida Escolar**: ocorrências, atendimento socioemocional, histórico consolidado e relatórios oficiais.
7. **Inclusão & AEE**: planos individuais, acompanhamento multiprofissional, gráficos de progresso.

### 3.2 Administrativo & Operacional
1. **RH e Folha Simplificada**: cadastro de colaboradores, lotação, integração com ERPs.
2. **Gestão Documental**: modelos versionados, fluxo de aprovação, assinatura digital ICP-Brasil.
3. **Biblioteca & Patrimônio**: inventário, empréstimos, RFID/QR tracking.
4. **Transporte Escolar**: rotas dinâmicas, telemetria, check-in/out via app com geofencing.
5. **Infraestrutura & Manutenção**: ordens de serviço, SLA, integrações IoT (sensores de ambiente).

### 3.3 Financeiro & Receita
1. **Mensalidades e Contratos**: geração automática, reajustes, bolsas e descontos condicionais.
2. **Gateway de Pagamento Integrado**: PIX, cartão, débito automático, split para parceiros.
3. **Cobrança Inteligente**: régua omnichannel, notificações push/SMS/WhatsApp, scoring de inadimplência.
4. **Tesouraria e Contabilidade**: centros de custo, conciliação bancária, exportação SPED.

### 3.4 Comunicação e Engajamento
1. **Portal Responsável/Aluno**: feed dinâmico, alertas críticos, documentos compartilhados.
2. **Mensageria Omnichannel**: push, e-mail, SMS, chat in-app, integrações WhatsApp/Teams.
3. **Comunidades & Fóruns**: moderação, gamificação, badges.
4. **Agenda e Eventos**: RSVP, pagamentos vinculados, integração com calendários externos.

### 3.5 Analytics & Inteligência
1. **Painéis Self-service**: drill-down por unidade/turma/aluno, exportações automatizadas.
2. **Modelos Preditivos**: evasão, desempenho, inadimplência usando pipelines ML.
3. **Data Lake Educacional**: camadas bronze/prata/ouro, catálogos e contratos de dados.
4. **Observabilidade Operacional**: health-check, tracing, auditoria com trilhas completas.

### 3.6 Marketplace & Plugins
- Catálogo oficial com versionamento, avaliações, dependências e políticas de segurança.
- SDK para web/mobile/backend com CLI de scaffolding.
- Suporte a plugins proprietários (p. ex. gamificação, ensino híbrido, BI avançado).

### 3.7 Experiência Mobile Moderna
- **Apps nativos ou Flutter/React Native** com UI convergente ao design system.
- **Modo Offline-First**: sincronização delta, fila de comandos e resolução de conflitos.
- **Notificações push ricas**: deep links para tarefas específicas, segmentação dinâmica.
- **Biometria e MFA**: autenticação segura com fallback a PIN.
- **Widgets e Quick Actions**: check-in de frequência, aprovação rápida, envio de recados.
- **Suporte a dispositivos institucionais e BYOD** com políticas MDM configuráveis.

## 4. Requisitos Não Funcionais
- **Segurança**: OAuth2/OIDC, MFA, RBAC/ABAC por domínio, criptografia em repouso e trânsito, LGPD/FERPA.
- **Performance**: SLAs de 2s P95 em operações críticas, filas assíncronas para tarefas pesadas.
- **Escalabilidade**: microsserviços desacoplados, autoscaling horizontal, cache distribuído (Redis/Memcached).
- **Disponibilidade**: 99,5% mínimo, estratégias de blue/green e feature flags.
- **Observabilidade**: métricas (Prometheus/OpenTelemetry), logs estruturados, tracing distribuído.
- **UX**: design tokens globais, acessibilidade WCAG 2.1 AA, internacionalização.
- **Governança de Dados**: lineage, catálogos, retenção configurável, consentimento granulado.

## 5. Arquitetura Técnica Proposta
### 5.1 Visão Macro
```
[ Client Apps (Web Next.js SPA/SSR + Mobile Flutter/React Native) ]
                 | GraphQL Gateway / REST Edge
[ BFF Layer ] ---+--- [ Core Services (NestJS) ] --- [ Event Bus ]
                 |                                 \
                 |                                  [ Plugin Services / Functions ]
                 +--- [ Admin APIs / Integration Hub (ESB + Webhooks) ]
```

### 5.2 Componentes Principais
- **Frontend Web**: Next.js + TypeScript, App Router, server actions, Tailwind + Radix UI, state Zod/React Query. Theming inspirado no WP (tema padrão + marketplace de temas).
- **Design System**: biblioteca de componentes com tokens (Style Dictionary), storybook temático, suporte a plugins visuais.
- **Backend Core**: NestJS modular, GraphQL Federation + REST, CQRS, Prisma/TypeORM, Redis, filas (BullMQ/Kafka).
- **Serviços Funcionais**: acadêmico, financeiro, comunicação, analytics – cada um com limites de contexto DDD e contratos públicos.
- **Plugins Backend**: carregados dinamicamente via contêineres sidecar ou WebAssembly; registros em catálogo com assinatura.
- **Integração**: camada iPaaS (via N8N/Temporal) para SIS/ERPs externos, webhooks assíncronos, conectores SSO.
- **Banco de Dados**: PostgreSQL principal, ElasticSearch para busca, S3 compatível para arquivos, Redis para sessões/cache.
- **Data & Analytics**: pipelines via dbt + Airflow, storage em lake (Iceberg/Delta) + ferramentas BI (Metabase/Superset) integradas ao painel.
- **Mobile BFF**: API Gateway otimizada, endpoints agregados, sincronização incremental.

### 5.3 Segurança e Compliance
- PKCE + OAuth2, SCIM para provisionamento, segredo rotacionado via Vault.
- Auditoria imutável (Append-only) com consultas federadas.
- Recursos segregados por tenant (multi-tenant com schemas dedicados ou row-level security).

### 5.4 DevOps e Entrega Contínua
- Monorepo com Nx/Turborepo; versionamento semântico por plugin.
- Pipelines CI/CD (GitHub Actions) com testes unitários, e2e, linters, segurança (SAST/DAST), publicação automatizada em registries internos.
- Observabilidade full-stack (Grafana, Loki, Tempo) e incident response runbooks.

## 6. Estratégia de Extensibilidade
- **Hooks**: lifecycle (beforeSave, afterPublish), UI slots, eventos de domínio em Kafka.
- **SDK**: pacotes `@capinalasoft/sdk-{web,mobile,server}` com clients, tipagens e helpers.
- **Webhooks e Jobs**: plugins podem registrar endpoints e tarefas programadas.
- **Marketplace**: assinatura digital, revisão manual, política de compatibilidade, sandbox.
- **Temas**: CSS-in-JS + tokens configuráveis, preview e rollback seguro.

## 7. Roadmap Faseado
1. **Fase 0 – Fundacional (0-2 meses)**
   - Definir domínios DDD, contratos de APIs, design system base, pipeline DevOps.
2. **Fase 1 – MVP Acadêmico (3-6 meses)**
   - Matrículas, turmas, diários, portal responsavel/aluno, app mobile com notas/frequência offline.
3. **Fase 2 – Administrativo & Financeiro (6-10 meses)**
   - Financeiro completo, contratos, cobrança, integrações contábeis, transporte.
4. **Fase 3 – Analytics & Marketplace (10-14 meses)**
   - Data lake, painéis, modelos preditivos, loja de plugins/temas.
5. **Fase 4 – Escala & Parcerias (14+ meses)**
   - Internacionalização, SDK público, certificações de segurança, ecossistema de parceiros.

## 8. Qualidade, Testes e Observabilidade
- Testes unitários (Jest/Vitest), integração (Supertest), contrato (Pact), e2e (Playwright/Detox), testes de carga (k6).
- QA automatizado para plugins (sandbox + testes obrigatórios).
- Feature flags e experimentos A/B no front/mobile com Telemetry Storage.

## 9. Documentação e Governança
- Portal único (MkDocs/Docusaurus) com guias para usuários, devs e designers.
- ADRs para decisões arquiteturais, playbooks de incidentes, políticas de versionamento.
- Programa de certificação e suporte para parceiros que desenvolverem plugins ou temas.
