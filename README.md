# capinalasoft-Edu

MVP de **sistema de gestão escolar Android** consumindo o **banco de dados do Gibbon** através de uma **REST API**.

Versão alvo do Gibbon: **v31**.

## Estrutura

- `api/`: REST API (FastAPI) conectando no MySQL do Gibbon
- `android/`: App Android (Kotlin + Jetpack Compose) consumindo a API

## API (FastAPI)

### Configuração

1) Ajuste as variáveis de ambiente:

- Copie `api/.env.example` para `api/.env` e edite o acesso ao MySQL do Gibbon
- Defina uma chave simples para o MVP (`API_KEY`)

2) Instale dependências e rode:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r api/requirements.txt

# rode a API
python3 -m uvicorn app.main:app --reload --app-dir api --host 0.0.0.0 --port 8000
```

### Endpoints

- `GET /health` (sem autenticação)
- `GET /gibbon/info` (requer header `X-API-Key`)
- `GET /students` (requer header `X-API-Key`)
- `GET /staff` (requer header `X-API-Key`)
- `GET /classes` (placeholder)

Exemplo:

```bash
curl -H "X-API-Key: dev-api-key" http://localhost:8000/students
```

## Android (Kotlin/Compose)

### Como apontar para a API

No emulador, use **`http://10.0.2.2:8000`** para acessar a API rodando na sua máquina.

Neste MVP, `BASE_URL` e `API_KEY` estão como `buildConfigField` em `android/app/build.gradle.kts`.

### Rodar

Abra a pasta `android/` no Android Studio e execute o app.

## Próximos passos sugeridos

- Autenticação real (login Gibbon, tokens, permissões)
- Frequência, notas, turmas/disciplinas e calendário
- Cache offline (Room) e sincronização
- Paginação e filtros avançados
