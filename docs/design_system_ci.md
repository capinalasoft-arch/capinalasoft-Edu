# Plano Design System + Pipeline CI/CD

## 1. Design System "Capinalasoft Atlas"
### 1.1 Fundamentos
- **Tokens**: definidos em Style Dictionary (`colors`, `spacing`, `typography`, `shadows`, `radii`, `motion`). Exportações para CSS, JS, Flutter (JSON) e React Native.
- **Temas**: `Default`, `HighContrast`, `Dark`, `EduPro`. Suporte a custom themes via plugin marketplace.
- **Grid & Layout**: 8pt baseline, container fluido, breakpoints alinhados ao WP: xs (0-480), sm, md, lg, xl.
- **Tipografia**: Variable font (Inter/Tilt) + fallback, escalas responsivas.
- **Iconografia**: biblioteca proprietária + Phosphor adaptado; suporte a ícones custom plugin.

### 1.2 Componentização
- **Camadas**: Foundations → Primitives (Button, Input, Surface) → Patterns (Navbar, DataTable, Cards) → Templates (Dashboard, Wizard, Form Builder).
- **Tecnologias**: Storybook 8 + Chromatic para regressão visual; tokens sincronizados via Git submodule.
- **Acessibilidade**: testes automáticos axe, suporte keyboard-first, WCAG 2.1 AA.
- **Documentação**: MDX + exemplos de código (React, Flutter) + guidelines de redação.

### 1.3 Integração com Plugins
- Expor "slots" visuais (widget areas) com contrato CSS vars + APIs.
- CLI para gerar componentes compatíveis que consomem tokens do núcleo.
- Versionamento semântico do DS, com pacotes `@capinalasoft/ds-react`, `@capinalasoft/ds-tokens`, `@capinalasoft/ds-icons`.

## 2. Pipeline CI/CD Base
### 2.1 Estrutura de Workflows
- `ci-pr.yml`: lint, testes unitários web/backend/mobile (mock), build DS, storybooklint, verificação schemas GraphQL/REST.
- `e2e.yml`: executa Playwright + Detox/Flutter driver em nightly ou antes de merge release.
- `release.yml`: semantic-release para versionar pacotes, publish npm/internal registry, gerar changelog.
- `deploy.yml`: ArgoCD sync trigger + build container backend/front; mobile build pipeline separado.

### 2.2 Steps Críticos
1. **Install**: PNPM install com cache Turbo.
2. **Lint/Format**: ESLint/Biome, stylelint, markdownlint.
3. **Tests**: Jest/Vitest, coverage gating (80%), supertest para APIs, Pact para contratos.
4. **Builds**: `yarn build:web`, `build:backend`, `build:ds`, `build:mobile-sim`.
5. **Static Analysis**: SonarCloud/Snyk, Trivy containers, dependency review.
6. **Artifacts**: Storybook estático, pacotes npm, imagens Docker, relatórios cobertura.
7. **Deploy**: usar environments protegidos, gates manuais para produção, feature flags.

### 2.3 Integração Mobile
- Workflow GitHub Actions chamando Codemagic/Fastlane via API.
- Testes em emuladores headless (Android) e simuladores cloud (iOS) antes de distribuição interna.
- Upload automático para Firebase App Distribution/TestFlight.

### 2.4 Observabilidade do Pipeline
- Publicar métricas (tempo build, falhas) em Grafana via GitHub Actions metrics exporter.
- Alertas Slack/Teams com contexto (commit, autor, erro, links artefatos).

### 2.5 Governança
- Branching: trunk-based com feature flags; merges via PR + revisão obrigatória.
- Proteções: status checks obrigatórios, verificação de assinaturas Commits (Sigstore optional).
- Templates: PR/issue templates com checklist (testes, docs, segurança).
- Releases: cadência quinzenal para core, semanal para plugins, on-demand para hotfix.
