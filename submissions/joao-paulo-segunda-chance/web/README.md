# Mesa de decisão RavenStack

Site: https://challenge-g4-ravenstack.early-hake-5665.chatgpt.site

Frontend React/TypeScript; regras de importação puras; adaptador Supabase Edge; Postgres com fontes, versões e evidência imutáveis. Os arquivos aqui não contêm dados de contas nem chaves privilegiadas. O endpoint é público por autorização do usuário.

## Frontend local
Node >=22.13.

```sh
cd web/frontend
npm install
npm run check
npm run build
npm run dev
```

O adaptador `lib/api.ts` aponta para o ambiente dedicado. Trocar URL ao reproduzir em outro projeto. Chamadas usam capacidades anônimas do backend; não configure service_role no frontend. A versão hospedada usa o starter Vinext de Sites com as mesmas telas e CSS. Este frontend Vite é portável e independente da hospedagem.

## Banco e Edge
Aplicar as migrações da fundação na ordem documentada em `docs/foundation_status.md`, carregar as fontes e depois aplicar:

1. `db/web_application.sql`
2. `db/web_account_detail.sql`
3. `db/analysis_materialized.sql`
4. `db/web_parse_reuse_guard.sql`

Implantar `web/edge/index.ts` com `web/domain/import.mjs`, `web/domain/contracts.mjs` e `web/edge/deno.json`. Nome: `challenge-web`. JWT do Supabase desativado nesta modalidade livre; o corpo exige a capacidade própria nas operações. `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são segredos internos padrão do ambiente Edge, não parâmetros de navegador.

`contracts.mjs` é gerado do registro Python `domain/source_contracts.py`. O teste de equivalência impede divergência silenciosa na referência. Ao mudar contrato/regra, atualize versões e testes nas duas linguagens.

## Testes

```sh
node --test web/tests/*.test.mjs
python web/tests/http_smoke.py
```

O teste de referência requer `CHALLENGE_DATA_DIR` com CSVs originais e `CHALLENGE_AUDIT_REPORT` com o relatório do auditor Python. Dados não são incluídos no GitHub.

O teste HTTP de Excel requer `python -m pip install -r requirements-web-tests.txt`.

`http_import.py --accounts-csv /caminho/ravenstack_accounts.csv` inspeciona Excel, bloqueia CSV inválido e cria uma prévia, sem publicar. O teste `tests/db_web_import_rollback.sql` valida a publicação inteira dessa prévia e reverte a transação. Não execute a opção `--publish` sem autorização específica para a atualização real.

## Limites
Ver `docs/web_status.md`: substituição completa de uma fonte por vez, limites de arquivo, identidade declarada, armazenamento de originais em Postgres e ausência de QA visual automatizado neste ambiente. Não há modelo de ML, alerta preditivo nem inferência causal.
