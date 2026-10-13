# Aplicação web — contrato operacional

Site: https://challenge-g4-ravenstack.early-hake-5665.chatgpt.site

## Escopo autorizado
Acesso livre, sem e-mail/senha, sobre o Supabase dedicado. Qualquer visitante pode ler o diagnóstico, importar uma fonte e registrar decisões/ações. Nome de autor e responsável é declarado, não verificado. Não existem papéis de usuário ativos nesta modalidade. Membership fica disponível para uma evolução futura, sem ser apresentado como proteção do acesso livre.

## Acesso e limites
- Frontend nunca recebe service_role. Edge obtém a chave apenas do ambiente Supabase.
- Capacidade aleatória de sete dias no localStorage; banco guarda apenas SHA-256. Autoriza sessão, não identidade.
- RLS em todas as tabelas; RPCs web executáveis exclusivamente pelo backend. Adaptador fixa o workspace RavenStack; não aceita SQL arbitrário, CRUD genérico ou workspace informado pelo navegador.
- Até 30 decisões e 10 arquivos/dia por sessão, 80 arquivos e 500 novas sessões/dia no conjunto. Proteção básica para o challenge, não defesa completa contra abuso distribuído.
- Toda sessão válida pode acompanhar/encerrar ações do workspace. Decisão/história imutáveis. Revisão otimista e fechamento/cancelamento com resultado/motivo.
- Sem exclusão de versões, envio de e-mails ou solicitações de revisão.

## Atualização
1. Inspecionar CSV UTF-8 ou Excel `.xlsx`, selecionar aba e mapear cada coluna.
2. No servidor, validar tipos, cabeçalhos, chaves e FK contra as outras quatro fontes.
3. Reexecutar 89 verificações; apresentar adicionados, removidos, alterados e ressalvas. Diferença de conteúdo inclui formatação da origem, não somente mudanças de negócio.
4. Preservar arquivo exato, mapeamento e linhas; após confirmação criar candidato.
5. Carregar partes de 300 linhas com checkpoints, verificar bytes/hash/contagem, promover, analisar e publicar atomicamente.
6. Se outra versão foi publicada durante o processamento, impedir sobrescrita e exigir nova prévia.

Substitui a fonte inteira; não é append/upsert. Nesta fase não há atualização conjunta de múltiplas fontes. A nova fonte precisa manter os vínculos com as outras quatro. Referência não pode ultrapassar o maior fato observado; término contratual futuro não comprova cobertura futura.

## Arquivos
Até 8 MB, 50.000 linhas, 128 colunas no Excel; expansão ZIP até 64 MB/1.500 entradas. Fórmulas rejeitadas: exportar valores. Um arquivo com os mesmos bytes não é reutilizado se outra aba/mapeamento produzir linhas diferentes; exportar essa aba em arquivo separado para preservar a linhagem. Datas ISO; booleanos true/false. Originais pequenos preservados em chunks `bytea` no Postgres; Storage é evolução futura. O conteúdo raw projetado pelo mapeamento conserva valores da fonte; nomes/colunas originais continuam no arquivo e metadados do mapeamento.

Não existe limpeza automática de previews/candidatos abandonados; monitorar volume. Capacidades expiradas impedem retomada de jobs da sessão antiga. Checkpoints podem ser retomados pela mesma sessão válida, inclusive depois de fechar/reabrir o site.

## Diagnóstico
Recortes por setor/país, pesquisa e ordenação explícita por nome, MRR ou ressalvas. Exploração, sem fila automática de retenção, ML, previsão de perda ou alegação causal de drivers. Referência histórica exibida; recebimento não se confunde com atualização factual.

## Verificação realizada
- 26 testes Python da fundação e 12 testes web: contratos, limite de referência e equivalência das contagens/denominadores dos 89 resultados com Python.
- SQL transacional: decisão, idempotência, resultado obrigatório, revisão, histórico e acesso.
- HTTP real: sessão, dashboard, conta, falta de sessão bloqueada, Excel inspecionado, prévia com 500 contas idênticas, CSV com número inválido rejeitado e painel ativo preservado.
- Publicação completa validada em transação revertida: manifesto de cinco fontes, checkpoints, análise, ponteiro atômico, 89 verificações, métricas idênticas, replay e evidência anterior preservada.
- Teste encontrou um plano inadequado em versão recém-promovida: estimativa de uma linha produzia busca de todos os contratos por linha de uso. CTEs materializadas e preferência por hash/merge joins foram limitadas à função analítica. Teste completo passou sob statement_timeout de 15 segundos; sem alterar regras de negócio.
- TypeScript/build do site e do frontend portável passaram. Site publicado em acesso público, conforme instrução do usuário.
- Advisor de segurança Supabase sem findings; performance aponta índices ainda sem uso em projeto novo, sem erro de segurança.
- Controle de navegador não disponível: QA visual, interação real no browser e screenshots ainda não realizados. Responsividade, foco e teclado foram implementados, mas exigem revisão visual posterior.

## Publicação de teste e revisão automática
A revisão automática bloqueou o teste HTTP com `--publish`, por alterar o ponteiro ativo no ambiente compartilhado. Foi substituído por validação completa em transação com rollback. O painel continua na versão original. A publicação real do site foi autorizada e concluída. Nenhuma PR foi criada.

## Reproduzir
Ver `web/README.md`. Migrações desta fase: `web_application.sql`, `web_account_detail.sql` e `analysis_materialized.sql` e `web_parse_reuse_guard.sql`, depois da fundação. A última contém a versão final das duas iterações de planejamento de consulta aplicadas no ambiente.

## Evoluções
Autenticação/papéis, lote com múltiplas fontes, Storage/filas para grandes arquivos, limpeza/monitoramento, auditoria de identidade e testes visuais. Evidências finais e submissão para avaliação permanecem pendentes.

## Aceitação posterior — 12/10/2026

O usuário autorizou continuar as validações, incluindo atualização efetiva. Uma segunda versão foi publicada por HTTP com as mesmas 500 contas e métricas; a versão anterior e seus snapshots continuam acessíveis. Há duas decisões `[QA]` concluídas, com três entradas de histórico cada; não são decisões do negócio.

Oito testes de componentes passaram: seis áreas, filtros/paginação/busca, foco/Escape, decisão com erro, conclusão com erro visível, retry do detalhe, upload inválido e pausa/retomada. Esse DOM emulado não comprova renderização em navegador real.

A aceitação HTTP encontrou que SQLSTATE 40001 provocava retries na revisão desatualizada. Nova migração `web_conflict_response.sql` usa PT409; Edge devolve HTTP 409. O teste SQL foi reforçado para exigir esse código e o teste HTTP confirmou revisão desatualizada, resultado ausente, idempotência e conclusão. Nenhum backend de teste em loop permaneceu na verificação final.

As narrativas e Git history atendem ao formato de evidência aceito pelo guia. Capturas/export integral são opcionais; revisão visual real continua pendente. Ver `docs/submission_readiness.md`.
