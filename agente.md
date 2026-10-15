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
│   │   ├── automation-exercise.cy.js   # cenários gerais (cadastro, login, logout)
│   │   └── login.cy.js                 # cenários do formulário de login
│   ├── fixtures/
│   │   └── example.json          # fixture padrão do Cypress (não usada)
│   ├── module/                   # "page objects" funcionais (import/export)
│   │   ├── cadastro/index.js     # fluxos de cadastro de usuário
│   │   └── login/index.js        # ações e validações de login
│   └── support/
│       ├── commands.js           # custom commands (cy.login, cy.deletarConta)
│       └── e2e.js                # carregado antes de cada spec
├── docs/                         # vazio (não versionado)
├── cypress.config.js             # configuração do Cypress
├── package.json                  # scripts e devDependencies
└── .gitignore                    # ignora node_modules, vídeos, screenshots, reports, .env
```

## Arquivos-chave

### `cypress.config.js`
- `watchForFileChanges: false` — o runner não reexecuta ao salvar arquivos.
- `e2e.baseUrl: 'https://www.automationexercise.com'` — permite `cy.visit('/login')`.
- `e2e.setupNodeEvents` vazio.

### `package.json`
- Script: `npm run test:headless` → `npx cypress run`.
- `"type": "commonjs"` (os arquivos de spec/módulo usam `import/export`, que o bundler do Cypress resolve).

### `cypress/support/e2e.js`
- Importa `./commands` e `cypress-xpath`.

### `cypress/support/commands.js`
| Comando | O que faz |
|---|---|
| `cy.login(email, senha)` | Preenche e envia o formulário de login via XPath. |
| `cy.deletarConta()` | Valida "Account Deleted!" e clica em Continue. |

### `cypress/module/` (padrão de módulos)
Funções exportadas com `export { ... }` e importadas nas specs **como namespace**:

```js
import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'
```

#### `cadastro/index.js`
| Função | Responsabilidade |
|---|---|
| `cadastroUsuarioTelaLogin(email)` | Preenche nome/e-mail no bloco "New User Signup!" e envia. |
| `cadastroNovoUsuario(email)` | Fluxo completo: abre `/login`, preenche todo o formulário de conta e confirma "Account Created!". |

#### `login/index.js`
Poucas funções, cada uma cobrindo uma ação ou um resultado de negócio. Seletores ficam no objeto interno `seletores`; os comandos Cypress são chamados diretamente dentro de cada função (sem objetos de callbacks/mapas de ações).

| Tipo | Função | Responsabilidade |
|---|---|---|
| Ação | `acessarTelaLogin()` | `cy.visit('/login')` e confirma o título "Login to your account". |
| Interna | `preencherCredenciais(email, senha)` | Não exportada. Registra o intercept `@requisicaoLogin` e preenche os campos (valor vazio = campo não preenchido). |
| Ação | `realizarLogin(email, senha)` | Preenche e envia clicando no botão Login. |
| Ação | `realizarLoginComEnter(email, senha, campo = 'senha')` | Preenche e envia pressionando Enter no `campo` informado (`'email'` ou `'senha'`). |
| Validação | `validarLoginComSucesso(email, nome = 'John Doe')` | E-mail enviado na requisição + "Logged in as John Doe". |
| Validação | `validarLoginComFalha(email, senha)` | E-mail/senha enviados + permanência em `/login` + "Your email or password is incorrect!". |
| Validação | `validarBloqueioDoNavegador(regra, ...campos)` | Para cada campo (`'email'`, `'senha'`): `validity[regra] === true` e `validationMessage` preenchida; além disso, nenhum POST enviado. |

- O corpo do POST é `application/x-www-form-urlencoded` (`@` vira `%40`), por isso a leitura é feita com `URLSearchParams`.
- Todos os asserts de login ficam no módulo; as specs só combinam uma ação com uma validação.

### `cypress/e2e/automation-exercise.cy.js`
- `beforeEach`: visita a home, valida `.features_items` e gera e-mail único (`john.doe.${Date.now()}@example.com`).
- Cenários:
  1. Cadastrar um novo usuário com sucesso (e excluir a conta ao final).
  2. Login com e-mail e senha corretos.
  3. Login com e-mail e senha incorretos.
  4. Logout de usuário.
  5. Cadastro de usuário com e-mail já existente.

### `cypress/e2e/login.cy.js`
- **Com usuário cadastrado** (`beforeEach` cria conta e faz logout; `afterEach` exclui a conta):
  1. Enviar o login pressionando Enter no campo de e-mail.
  2. Enviar o login pressionando Enter no campo de senha.
  3. Login com e-mail cadastrado e senha incorreta (no final, entra com a senha correta para permitir a exclusão).
- **Validações do navegador (HTML5)** (`beforeEach` abre `/login`):
  4. Campos e-mail e senha vazios → `valueMissing`.
  5. E-mails inválidos `usuario`, `usuario@`, `usuario@.com` → `typeMismatch` (data-driven com `forEach`).
- Observação: `usuario@exemplo` (sem ponto) é aceito pelo navegador como e-mail válido — não usar como caso inválido.

### `.github/workflows/pipeline.yml`
- Gatilhos: `push` e `pull_request` na `main`, além de `workflow_dispatch`.
- Passos: checkout → setup-node (`latest`) → `npm ci` → `npm run test:headless`.
- Upload de relatório está comentado (não há reporter configurado).

## Convenções

- **Seletores:** atributos `data-qa` (`input[data-qa=...]`); XPath só resta em `cy.login`.
- **Dados de teste:** e-mail dinâmico por teste para evitar colisão; senha fixa `123456`; usuário fictício "John Doe".
- **Limpeza:** cenários que criam conta devem excluí-la (`a[href="/delete_account"]` + `cy.deletarConta()`), de preferência em `afterEach`.
- **Reuso:** fluxos vão para `cypress/module/<fluxo>/index.js`, importados como namespace; ações curtas e transversais viram custom commands em `support/commands.js`.
- **Módulos compactos:** poucas funções por ação/resultado de negócio, sem quebrar em uma função por detalhe.
- **Responsabilidade única:** cada função faz um único tipo de ação; formas diferentes de executar algo (ex.: enviar por clique vs. por Enter) viram funções separadas, não `if/else` por parâmetro. Trechos comuns vão para uma função interna não exportada.
- **Comandos Cypress diretos:** as ações do Cypress (`cy.get(...).click()`, `.type(...)`) ficam escritas dentro do corpo da própria função; não usar objetos de callbacks/mapas de ações (ex.: `const envios = { botao: () => ... }`). O único objeto auxiliar aceito é o de `seletores`.
- **Asserts centralizados:** validações ficam em funções `validar...` dentro do módulo, não espalhadas nas specs.
- **Specs enxutas:** cada `it` combina chamadas de ação e de validação do módulo (ex.: `login.realizarLogin(...)` + `login.validarLoginComFalha(...)`), sem `cy.get`/`should` soltos para o fluxo testado.
- **Sem comentários no código:** não adicionar comentários em specs, módulos ou commands; nomes de funções, parâmetros e títulos de `it` devem bastar. Explicações (ex.: valores aceitos de um parâmetro) ficam neste `agente.md`. Os comentários do template padrão do Cypress (`support/e2e.js`, `cypress.config.js`) podem permanecer.
- **Idioma:** nomes de funções, comandos e títulos de `it` em português.
- **Commits:** prefixos no estilo `tests:` e `chores:`.

## Como executar

```bash
npm ci                    # instalar dependências
npx cypress open          # modo interativo
npm run test:headless     # modo headless (igual ao CI)
npx cypress run --spec cypress/e2e/login.cy.js   # uma spec específica
```

- **Terminal do VS Code:** o VS Code define `ELECTRON_RUN_AS_NODE=1`, o que faz o Cypress falhar com `cachedDataRejected`. Remova a variável antes de rodar:
  - Bash: `env -u ELECTRON_RUN_AS_NODE npx cypress run`
  - PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE; npx cypress run`

## Pontos de atenção

- `cy.login` (commands, via XPath) duplica a lógica de `login.realizarLogin` (módulo) — preferir o módulo.
- O módulo `cadastro` ainda não segue as convenções do módulo `login`: mistura asserts nas ações (`cadastroNovoUsuario` valida "Account Created!") e não tem objeto `seletores` nem funções `validar...`.
- `automation-exercise.cy.js` ainda tem asserts soltos na spec (ex.: `cy.url().should('include', '/login')` no logout, `.navbar-nav` no cadastro).
- Os cenários "Logout" e "E-mail já existente" não excluem a conta criada, deixando usuários residuais no site.
- O `describe` de `automation-exercise.cy.js` ainda se chama `'template spec'`.
- No pipeline, o passo se chama "Executando os testes internos de API", mas executa testes E2E de interface.
- `node-version: latest` pode quebrar o CI em atualizações do Node; considerar fixar uma versão LTS.
