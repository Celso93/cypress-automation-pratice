# cypress-web-project

Testes E2E na camada de interface web com **Cypress 13**, executados contra o site de prática [Automation Exercise](https://www.automationexercise.com).

## Pré-requisitos

- Node.js (LTS recomendado)
- npm

## Instalação

```bash
npm ci
```

## Configuração (`.env`)

A URL base dos testes é lida da variável `BASE_URL` em um arquivo `.env` na raiz. Esse arquivo **não é versionado**; use o modelo:

```bash
cp .env.example .env
```

```dotenv
BASE_URL=https://www.automationexercise.com
```

Se o `.env` não existir ou `BASE_URL` estiver vazia, o `cypress.config.js` usa `https://www.automationexercise.com` como fallback. O CI roda sem `.env`, usando esse fallback.

## Estrutura

```
cypress/
├── e2e/
│   ├── exercicio-final/          # exercício final (roda no CI)
│   │   ├── usuario.cy.js         # TC 1–5: cadastro, login, logout, e-mail duplicado
│   │   ├── produtos.cy.js        # TC 8–9: listagem, detalhe e busca de produtos
│   │   ├── inscricao.cy.js       # TC 10: inscrição na newsletter (home)
│   │   └── pedido.cy.js          # TC 15–16: pedido com cadastro / com login antes do checkout
│   └── exercicios/               # exercícios anteriores das aulas
│       ├── automation-exercise-xpath.cy.js
│       └── login.cy.js
├── module/                       # ações e validações reutilizáveis por funcionalidade
│   ├── cadastro/ carrinho/ checkout/ inscricao/ login/ produtos/
└── support/
    ├── commands.js               # custom commands (cy.login, cy.deletarConta)
    └── e2e.js                    # registra cypress-xpath, mochawesome e @cypress/grep
```

## Como executar

| Comando | O que roda |
|---|---|
| `npx cypress open` | Modo interativo |
| `npm run test:headless` | Todas as specs, headless |
| `npm run test:exercicio-final` | Somente a pasta `cypress/e2e/exercicio-final/` |
| `npm run test:exercicio-final:tag` | Somente os testes com a tag `@exercicio-final` (em qualquer pasta) |
| `npm run test:ci` | O que o CI executa (= `test:exercicio-final`) |

> **Terminal do VS Code:** o VS Code define `ELECTRON_RUN_AS_NODE=1`, o que faz o Cypress falhar com `cachedDataRejected`. Remova a variável antes de rodar:
> - Bash: `env -u ELECTRON_RUN_AS_NODE npm run test:exercicio-final`
> - PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE; npm run test:exercicio-final`

## Tags

As specs do exercício final usam a tag `@exercicio-final` no `describe`, via [`@cypress/grep`](https://github.com/cypress-io/cypress/tree/develop/npm/grep). Para filtrar por outra tag:

```bash
npx cypress run --env grepTags=@minha-tag,grepOmitFiltered=true
```

`grepFilterSpecs=true` não funciona no Windows (o plugin monta o glob com `\` e o Cypress não encontra as specs), por isso o script usa `grepOmitFiltered`.

## Configurações relevantes (`cypress.config.js`)

- **`retries`**: `openMode: 0`, `runMode: 3` (até 3 novas tentativas no headless/CI).
- **`testIsolation: true`**: cada teste começa com cookies, storage e página limpos.
- **`blockHosts`**: bloqueia domínios de anúncios/analytics do Google. Os anúncios do site abrem um vignette em tela cheia que intercepta cliques e é a principal causa de falhas intermitentes.
- **Reporter**: `cypress-mochawesome-reporter`, gerando HTML em `cypress/reports/html`.

## CI

`.github/workflows/pipeline.yml` roda em `push`/`pull_request` na `main` e via `workflow_dispatch`:

1. `npm ci`
2. `npm run test:ci` (somente o exercício final)
3. Publica `cypress/reports/html` como artefato `report`
