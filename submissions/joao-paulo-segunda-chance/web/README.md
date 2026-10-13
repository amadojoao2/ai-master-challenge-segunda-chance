# Mesa de decisão RavenStack

Site: https://challenge-g4-ravenstack.early-hake-5665.chatgpt.site

Frontend React/TypeScript; regras de importação puras; adaptador Supabase Edge; Postgres com fontes, versões e evidência imutáveis. Os arquivos aqui não contêm dados de contas nem chaves privilegiadas. O endpoint é público por autorização do usuário.

## Frontend local
Node >=22.13.

```sh
cd web/frontend
npm install
npm run check
npm run test:ui
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
5. `db/web_conflict_response.sql`
6. `db/decision_scopes.sql`

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

## Aceitação de componentes e HTTP

`npm run test:ui` testa 13 fluxos de componentes e quatro contratos de adaptadores usando Happy DOM 21.0.1 e API simulada. Não executa navegador real nem valida CSS/viewport visualmente. Arquivos temporários em `tests/.generated` são ignorados.

O ciclo efetivo `http_import.py --accounts-csv /caminho/original.csv --publish` foi autorizado e concluído em 12/10/2026, preservando os fatos e criando a segunda versão. `http_decisions.py --write-qa` grava uma decisão claramente marcada `[QA]` e conclui sua ação. Não rodar os testes de escrita sem intenção explícita de persistir esses registros.

A revisão concorrente usa SQLSTATE PT409/HTTP 409. Não usar 40001 para erro de negócio: a aceitação real mostrou retries/timeout que não apareciam no teste SQL isolado. Ver Process Log de aceitação.


## Escopo das decisões

O formulário novo permite conta, segmento por setor/país, carteira e qualidade, com dado principal, prévia de backend e evidência/membros congelados. Ver [contrato e estado](../docs/decision_scopes.md). Migração aplicada e adaptador publicado como JavaScript gerado em 12/10/2026, após erros internos no empacotamento TypeScript.

Implantar também `challenge-decisions`: os fontes são `web/decisions/index.ts` e `web/domain/decision_scope.mjs`; o pacote utilizado com sucesso é gerado com `node scripts/build_decision_edge.mjs --output .work/decision-edge/index.js`, após instalar dependências em `web/frontend`. Usar `index.js` gerado como entrada. O frontend roteia três operações para esse adaptador e mantém a sessão/importação/leitura no `challenge-web`. Os dois usam a mesma capacidade própria e runtime secreto, sem chave privilegiada no frontend. O empacotador usa as regras canônicas sem cópia manual nem segredos.

Depois de implantar, `python web/tests/http_scopes.py` valida quatro escopos, agregações e bloqueios, sem gravar decisão. `--write-qa` persiste um registro de QA e conclui sua ação. Os testes de leitura e `--write-qa` passaram em 12/10/2026; a ação QA foi concluída e a interface publicada após a aceitação.
