# agente.md — Estrutura do Projeto `cypress-web-project`

## Visão geral

- Projeto de testes E2E na camada de interface web com **Cypress 13** (`cypress@^13.7.3`).
- Aplicação sob teste: https://www.automationexercise.com/ (site público de prática).
- Plugin extra: **`cypress-xpath`** — habilita `cy.xpath(...)` (hoje usado só em `cy.login`).
- Sem código de aplicação: o repositório contém apenas testes, módulos reutilizáveis e configuração.

## Árvore de diretórios

```
cypress-web-project/
├── .github/
│   └── workflows/
│       └── pipeline.yml          # CI no GitHub Actions
├── cypress/
│   ├── e2e/
│   │   ├── exercicio-final/      # exercício final — único conjunto executado no CI
│   │   │   ├── usuario.cy.js     # TC 1–5
│   │   │   ├── produtos.cy.js    # TC 8–9
│   │   │   ├── inscricao.cy.js   # TC 10
│   │   │   └── pedido.cy.js      # TC 15–16
│   │   └── exercicios/           # exercícios anteriores das aulas
│   │       ├── automation-exercise-xpath.cy.js
│   │       └── login.cy.js
│   ├── fixtures/
│   │   └── example.json          # fixture padrão do Cypress (não usada)
│   ├── module/                   # "page objects" funcionais (import/export)
│   │   ├── cadastro/index.js
│   │   ├── carrinho/index.js
│   │   ├── checkout/index.js
│   │   ├── inscricao/index.js
│   │   ├── login/index.js
│   │   └── produtos/index.js
│   └── support/
│       ├── commands.js           # custom commands (cy.login, cy.deletarConta)
│       └── e2e.js                # carregado antes de cada spec
├── docs/                         # vazio (não versionado)
├── .env.example                  # modelo do .env (BASE_URL)
├── cypress.config.js             # configuração do Cypress
├── package.json                  # scripts e devDependencies
├── README.md                     # guia de uso do projeto
└── .gitignore                    # ignora node_modules, vídeos, screenshots, reports, .env
```

## Arquivos-chave

### `cypress.config.js`
- Carrega o `.env` com `dotenv`; `baseUrl` vem de `BASE_URL`, com fallback para `https://www.automationexercise.com` quando ausente/vazia.
- `watchForFileChanges: false` — o runner não reexecuta ao salvar arquivos.
- `blockHosts` — bloqueia domínios de anúncios/analytics do Google (o vignette de anúncio intercepta cliques e causava falhas intermitentes).
- `retries` — `openMode: 0`, `runMode: 3`.
- `reporter: 'cypress-mochawesome-reporter'` → HTML em `cypress/reports/html`.
- `e2e.testIsolation: true` (explícito).
- `e2e.setupNodeEvents` registra os plugins do mochawesome e do `@cypress/grep` e retorna `config`.

### `package.json`
| Script | Comando |
|---|---|
| `test:headless` | `npx cypress run` (todas as specs) |
| `test:exercicio-final` | `--spec "cypress/e2e/exercicio-final/**/*.cy.js"` |
| `test:exercicio-final:tag` | `--env grepTags=@exercicio-final,grepOmitFiltered=true` |
| `test:ci` | `npm run test:exercicio-final` |

- `"type": "commonjs"` (os arquivos de spec/módulo usam `import/export`, que o bundler do Cypress resolve).
- `grepFilterSpecs=true` do `@cypress/grep` não funciona no Windows (glob com `\`, nenhuma spec encontrada) — usar `grepOmitFiltered`.

### `cypress/support/e2e.js`
- Importa `./commands`, `cypress-xpath`, `cypress-mochawesome-reporter/register` e registra o `@cypress/grep`.

### `cypress/support/commands.js`
| Comando | O que faz |
|---|---|
| `cy.login(email, senha)` | Preenche e envia o formulário de login via XPath. |
| `cy.deletarConta()` | Valida "Account Deleted!" e clica em Continue. |

### `cypress/module/` (padrão de módulos)
Funções exportadas com `export { ... }` e importadas nas specs **como namespace**:

```js
import * as cadastro from '../../module/cadastro/index.js'
import * as login from '../../module/login/index.js'
```

#### `cadastro/index.js`
| Função | Responsabilidade |
|---|---|
| `cadastroUsuarioTelaLogin(email)` | Preenche nome/e-mail no bloco "New User Signup!" e envia. |
| `cadastroNovoUsuario(email)` | Fluxo completo: abre `/login`, preenche todo o formulário de conta e confirma "Account Created!". |
| `excluirConta()` | Clica em "Delete Account" e chama `cy.deletarConta()`. |
| `validarEmailJaCadastrado()` | Permanência em `/signup` + "Email Address already exist!". |

#### `login/index.js`
Poucas funções, cada uma cobrindo uma ação ou um resultado de negócio. Seletores ficam no objeto interno `seletores`; os comandos Cypress são chamados diretamente dentro de cada função (sem objetos de callbacks/mapas de ações).

| Tipo | Função | Responsabilidade |
|---|---|---|
| Ação | `acessarTelaLogin()` | `cy.visit('/login')` e confirma o título "Login to your account". |
| Interna | `preencherCredenciais(email, senha)` | Não exportada. Registra o intercept `@requisicaoLogin` e preenche os campos (valor vazio = campo não preenchido). |
| Ação | `realizarLogin(email, senha)` | Preenche e envia clicando no botão Login. |
| Ação | `realizarLoginComEnter(email, senha, campo = 'senha')` | Preenche e envia pressionando Enter no `campo` informado (`'email'` ou `'senha'`). |
| Ação | `realizarLogout()` | Clica em "Logout". |
| Validação | `validarUsuarioLogado(nome = 'John Doe')` | "Logged in as John Doe" no menu. |
| Validação | `validarLogoutRealizado()` | Redirecionamento para `/login` + link "Logout" ausente. |
| Validação | `validarLoginComSucesso(email, nome = 'John Doe')` | E-mail enviado na requisição + "Logged in as John Doe". |
| Validação | `validarLoginComFalha(email, senha)` | E-mail/senha enviados + permanência em `/login` + "Your email or password is incorrect!". |
| Validação | `validarBloqueioDoNavegador(regra, ...campos)` | Para cada campo (`'email'`, `'senha'`): `validity[regra] === true` e `validationMessage` preenchida; além disso, nenhum POST enviado. |

- O corpo do POST é `application/x-www-form-urlencoded` (`@` vira `%40`), por isso a leitura é feita com `URLSearchParams`.
- Todos os asserts de login ficam no módulo; as specs só combinam uma ação com uma validação.

#### `produtos/`, `inscricao/`, `carrinho/`, `checkout/`
Seguem o mesmo padrão (`seletores` → ações → `validar...`) e atendem os TC 8–10 e 15–16.

### `cypress/e2e/exercicio-final/` (tag `@exercicio-final`, executado no CI)
Cada spec tem seu próprio `beforeEach` (`cy.visit('/')` e, quando necessário, e-mail único `john.doe.${Date.now()}@example.com`). Todo cenário que cria conta a exclui no final.

| Spec | Cenários |
|---|---|
| `usuario.cy.js` | TC 1 Register User · TC 2 Login correto · TC 3 Login incorreto · TC 4 Logout · TC 5 E-mail já existente |
| `produtos.cy.js` | TC 8 Todos os produtos e detalhe · TC 9 Busca de produto |
| `inscricao.cy.js` | TC 10 Inscrição na home |
| `pedido.cy.js` | TC 15 Pedido com cadastro antes do checkout · TC 16 Pedido com login antes do checkout |

- TC 6, 7 e 11–14 ainda não foram implementados; novos casos devem entrar na spec da funcionalidade correspondente (ex.: carrinho → `carrinho.cy.js`) com a mesma tag.

### `cypress/e2e/exercicios/` (fora do CI)
- `automation-exercise-xpath.cy.js` — cenários de cadastro/login/logout usando XPath.
- `login.cy.js`:
  - **Com usuário cadastrado** (`beforeEach` cria conta e faz logout; `afterEach` exclui a conta): Enter no e-mail, Enter na senha, senha incorreta.
  - **Validações do navegador (HTML5)**: campos vazios → `valueMissing`; e-mails `usuario`, `usuario@`, `usuario@.com` → `typeMismatch`.
  - `usuario@exemplo` (sem ponto) é aceito pelo navegador como e-mail válido — não usar como caso inválido.

### `.github/workflows/pipeline.yml`
- Gatilhos: `push` e `pull_request` na `main`, além de `workflow_dispatch`.
- Passos: checkout → setup-node (`latest`) → `npm ci` → `npm run test:ci` (somente `exercicio-final/`) → upload de `cypress/reports/html` como artefato `report`.

## Convenções

- **Organização das specs:** uma spec por funcionalidade (`usuario`, `produtos`, `pedido`...) dentro da pasta do conjunto (`exercicio-final/`, `exercicios/`). Imports de módulo usam `../../module/...`.
- **Seletores:** atributos `data-qa` (`input[data-qa=...]`); XPath só resta em `cy.login` e na spec de XPath.
- **Dados de teste:** e-mail dinâmico por teste para evitar colisão; senha fixa `123456`; usuário fictício "John Doe".
- **Limpeza:** cenários que criam conta devem excluí-la (`cadastro.excluirConta()`); se o cenário termina deslogado, fazer login antes de excluir.
- **Reuso:** fluxos vão para `cypress/module/<fluxo>/index.js`, importados como namespace; ações curtas e transversais viram custom commands em `support/commands.js`.
- **Módulos compactos:** poucas funções por ação/resultado de negócio, sem quebrar em uma função por detalhe.
- **Responsabilidade única:** cada função faz um único tipo de ação; formas diferentes de executar algo (ex.: enviar por clique vs. por Enter) viram funções separadas, não `if/else` por parâmetro. Trechos comuns vão para uma função interna não exportada.
- **Comandos Cypress diretos:** as ações do Cypress (`cy.get(...).click()`, `.type(...)`) ficam escritas dentro do corpo da própria função; não usar objetos de callbacks/mapas de ações (ex.: `const envios = { botao: () => ... }`). O único objeto auxiliar aceito é o de `seletores`.
- **Asserts centralizados:** validações ficam em funções `validar...` dentro do módulo, não espalhadas nas specs.
- **Ordem no módulo:** objeto `seletores` → funções de ação (`acessar...`, `pesquisar...`, `realizar...`) → funções `validar...` no final do arquivo, sem intercalar ações e validações. O `export { ... }` segue a mesma ordem.
- **Specs enxutas:** cada `it` combina chamadas de ação e de validação do módulo (ex.: `login.realizarLogin(...)` + `login.validarLoginComFalha(...)`), sem `cy.get`/`should` soltos para o fluxo testado.
- **Sem comentários no código:** não adicionar comentários em specs, módulos ou commands; nomes de funções, parâmetros e títulos de `it` devem bastar. Explicações (ex.: valores aceitos de um parâmetro) ficam neste `agente.md`. Os comentários do template padrão do Cypress (`support/e2e.js`, `cypress.config.js`) podem permanecer.
- **Idioma:** nomes de funções, comandos e títulos de `it` em português.
- **Commits:** prefixos no estilo `tests:` e `chores:`.

## Como executar

```bash
npm ci                              # instalar dependências
npx cypress open                    # modo interativo
npm run test:headless               # todas as specs
npm run test:exercicio-final        # somente o exercício final (igual ao CI)
npm run test:exercicio-final:tag    # somente testes com a tag @exercicio-final
npx cypress run --spec cypress/e2e/exercicios/login.cy.js   # uma spec específica
```

- **Terminal do VS Code:** o VS Code define `ELECTRON_RUN_AS_NODE=1`, o que faz o Cypress falhar com `cachedDataRejected`. Remova a variável antes de rodar:
  - Bash: `env -u ELECTRON_RUN_AS_NODE npx cypress run`
  - PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE; npx cypress run`

## Pontos de atenção

- `cy.login` (commands, via XPath) duplica a lógica de `login.realizarLogin` (módulo) — preferir o módulo.
- O módulo `cadastro` ainda não tem objeto `seletores` e `cadastroNovoUsuario` mistura o assert "Account Created!" na ação.
- `automation-exercise-xpath.cy.js` ainda tem asserts soltos na spec e não segue o padrão de módulos.
- `node-version: latest` pode quebrar o CI em atualizações do Node; considerar fixar uma versão LTS.
