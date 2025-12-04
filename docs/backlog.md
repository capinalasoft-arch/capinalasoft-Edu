# Backlog Inicial Prioritário

## Estrutura
- **Épicos**: agrupam entregas estratégicas alinhadas às fases do roadmap.
- **Features**: fatias entregáveis com critérios de aceite claros.
- **Tarefas Técnicas**: itens executáveis por squads, com dependências explícitas.
- **Status**: `Discovery`, `Ready`, `In Progress`, `Blocked`, `Done`.

## Épico E1 – Plataforma Fundacional
| Feature | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| F1.1 Monorepo & Tooling | Configurar monorepo (Nx/Turborepo), padronizar lint/test/build, GitHub Actions base | Alta | Discovery |
| F1.2 Core Domain Model | Modelagem DDD dos contextos (Acadêmico, Financeiro, Comunicação, Analytics) + ADRs | Alta | Discovery |
| F1.3 Design Tokens & DS Base | Tokens, tipografia, cores, grid, componentes atômicos (Button, Input, Card) | Alta | Discovery |
| F1.4 Plugin Runtime MVP | Contratos de plugin backend/frontend, CLI scaffold, sandbox local | Alta | Discovery |
| F1.5 Security Baseline | OAuth/OIDC, RBAC inicial, logging de auditoria, hardening DevSecOps | Alta | Discovery |

## Épico E2 – MVP Acadêmico Web + Mobile
| Feature | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| F2.1 Cadastro Acadêmico | CRUD de escolas, cursos, turmas, calendários com validações | Alta | Discovery |
| F2.2 Matrículas Inteligentes | Workflow de inscrição/aprovação, fila de espera, notificações | Alta | Discovery |
| F2.3 Diário Digital | Lançamento de notas/frequência web e mobile offline-first | Alta | Discovery |
| F2.4 Portal Responsável | Feed, documentos, pagamentos, push segmentado | Alta | Discovery |
| F2.5 App Mobile Core | Flutter/React Native com auth biométrica, sincronização delta | Alta | Discovery |
| F2.6 Relatórios Oficiais | Emissão de documentos e exportação para órgãos educacionais | Média | Discovery |

## Épico E3 – Administrativo & Financeiro
| Feature | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| F3.1 Financeiro 360° | Contratos, mensalidades, bolsas, reajustes, integração gateway | Alta | Discovery |
| F3.2 Cobrança Omnichannel | Regras de régua de cobrança com notificações multicanal | Alta | Discovery |
| F3.3 Transporte Inteligente | Rotas, check-in georreferenciado, telemetria, app motorista | Média | Discovery |
| F3.4 Biblioteca & Patrimônio | Inventário, empréstimos, QR/RFID, relatórios de uso | Média | Discovery |

## Épico E4 – Analytics & Marketplace
| Feature | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| F4.1 Data Platform | Pipelines ETL/ELT, data lake, catálogo, governança | Alta | Discovery |
| F4.2 Dashboards Self-Service | Painéis moduláveis, métricas por persona, exportações | Alta | Discovery |
| F4.3 Modelos Preditivos | Evasão, inadimplência, desempenho, com MLOps básico | Média | Discovery |
| F4.4 Marketplace Plugins/Temas | Catálogo, assinatura digital, billing, reviews | Alta | Discovery |

## Épico E5 – Experiência Mobile Avançada
| Feature | Descrição | Prioridade | Status |
| --- | --- | --- | --- |
| F5.1 Offline Framework | Engine de sincronização delta, fila de comandos, conflitos | Alta | Discovery |
| F5.2 Push & Engagement | Notificações ricas, deep links, widgets, quick actions | Alta | Discovery |
| F5.3 BYOD & MDM | Políticas de dispositivo, remote wipe, perfis multi-usuário | Média | Discovery |

## Dependências e Sequência Recomendada
1. Concluir E1 antes de habilitar squads em E2/E3 (infra + DS + plugins + segurança).
2. E2 e E3 podem rodar em paralelo após fundação, compartilhando componentes.
3. E4 depende parcialmente dos dados consolidados de E2/E3, porém Data Platform básica deve iniciar no fim de E1.
4. E5 se apoia na infra mobile lançada em F2.5 e nas integrações push (E2/E3).

## Critérios de Aceite Gerais por Feature
- Design aderente ao DS, responsivo, acessível.
- APIs versionadas + contratos testados (Pact/OpenAPI/GraphQL SDL).
- Testes unitários >80% feature-critical, integração e e2e críticos.
- Observabilidade: métricas, logs estruturados, tracing de negócio.
- Documentação atualizada (README, ADRs, guias de usuário quando aplicável).

## Próximos Passos Operacionais
1. Ranqueamento MoSCoW + estimativas de esforço (story points) por squad.
2. Abrir issues/épicos no tracker (Linear/Jira/GitHub) com responsáveis e milestones.
3. Definir Definition of Ready/Done e templates de issue/PR.
4. Criar cadência de planejamento (PI Planning / Sprint Planning) alinhada às fases.
