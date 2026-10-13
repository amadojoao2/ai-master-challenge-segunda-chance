# Decisões com escopo explícito

## Estado em 12/10/2026
Código implementado e testes de domínio, componentes, adaptadores e SQL aprovados. Migração aplicada ao Supabase dedicado. **Publicação do novo adaptador Edge bloqueada por erro interno do Supabase.** O site público continua na versão anterior; o novo formulário ainda não está disponível nele. HTTP efetivo do novo fluxo e QA visual real permanecem pendentes.

## Contrato de negócio

| Escopo | Seleção | População preservada |
|---|---|---|
| Conta | Nome/ID de uma conta | Snapshot daquela conta |
| Segmento | Setor, país ou ambos | Todas as contas elegíveis do recorte na versão escolhida |
| Carteira | Sem filtros implícitos | Todas as contas daquela análise |
| Qualidade | Fonte relacionada e verificação com ocorrências | Resultado/denominador da verificação, sem inventar vínculos com contas |

Para conta/segmento/carteira, o dado principal pode ser churn cadastral sem cancelamento registrado, flag cadastral, MRR contratual, uso observado ou satisfação. A métrica destaca casos pertinentes dentro da população; população e destaque não são intercambiáveis. No segmento, busca de texto e filtro de reconciliação do painel não se tornam filtros escondidos da decisão.

A abertura pelo detalhe herda a conta. A abertura pelo painel herda setor/país quando exibidos. A abertura por um problema de qualidade herda fonte/verificação. O usuário pode mudar a seleção e precisa revisar a nova evidência antes de gravar.

## Evidência e consistência temporal

A prévia vem do banco, não de agregações enviadas pelo navegador. Inclui escopo normalizado, regra/versão, análise/data de referência, população, destaques, medida/denominador, advertências e snapshots. O backend recompõe e confere o hash antes da gravação. Mudança de versão exige atualizar contexto e revisar novamente; textos do rascunho permanecem.

Decisão, escopo, membros, ação e primeira entrada de histórico são gravados na mesma transação. FKs impedem misturar workspace/versões; triggers impedem atualizar/apagar decisões, escopos e membros. A lista de membros contém toda a população, com destaque separado; o formulário exibe apenas amostra de até 20. Importações posteriores não redefinem a decisão. Replay da mesma chave/conteúdo é idempotente inclusive após nova publicação; reutilização com outro conteúdo produz PT409/HTTP 409.

Decisões antigas continuam legíveis, sem retropreencher um escopo que não foi registrado. Lista com busca e filtro por escopo; histórico com evidência preservada.

## Regras que evitam conclusão incorreta

- Satisfação agregada usa soma(nota média × respondentes)/soma(respondentes). A cobertura tem tickets elegíveis fechados como denominador.
- Sem uso qualificado, a medida continua NULL; não se transforma em zero nem comprova desengajamento.
- MRR é contratual na unidade da fonte, sem inferir moeda, risco ou perda.
- Flag sem cancelamento não demonstra motivo/data/receita perdida.
- Qualidade usa a base inteira da verificação na versão, sem atribuir janela de 30 dias ou contas sem vínculo verificável. Regras que cruzam fontes aparecem em cada fonte relacionada.
- Setor/país não possuem histórico de alteração e resultados de ações não demonstram causalidade.

## Arquitetura

`decision_scope.mjs` contém o value object e as Specifications de formato/aplicabilidade, sem DOM/SQL. `analytics.decision_rules` registra definições de negócio. RPCs implementam casos de uso transacionais; `operations.decision_scopes` e `decision_scope_snapshots` preservam a evidência. React é apresentação; `challenge-decisions` é adaptador HTTP pequeno, independente do leitor Excel do contexto de ingestão. Regras analíticas existentes são reutilizadas através dos snapshots, sem refazer a engenharia temporal.

Mesma capacidade anônima criada por `challenge-web/session`, hash no banco, RPCs exclusivamente service_role. Sem e-mail/senha, chave privilegiada no frontend, novo papel ou permissão anônima direta ao banco.

## Validação

- Seis testes do value object, incluindo coerção indevida de array para tipo: vermelho reproduzido, corrigido.
- 13 testes React em Happy DOM; prévia obrigatória, seleção de conta, herança de setor, fonte/regra, mudança de recorte, atualização com rascunho preservado e leitura de legado.
- Quatro testes de adaptadores com fetch simulado: capacidade, dispatch fixo, hash, status de conflito/sessão e roteamento frontend. Não comprovam execução no Supabase.
- SQL real em transação revertida com service_role: segmento 2 contas/MRR 400; satisfação ponderada 2,5 com 4 respostas/5 tickets; uso ausente NULL; qualidade 2/5 sem membros; critérios incompatíveis, hash inválido e versão antiga bloqueados; idempotência, imutabilidade e FKs.
- Leitura real de FinTech: 112 contas, 12 flags sem cancelamento, satisfação 3,923076923 com 13 respondentes/22 tickets fechados, MRR contratual 2.416.050 na unidade da fonte; uso qualificado 1.928 com registros em 87/112 contas. Não são previsões de churn/perda.
- TypeScript e build do frontend portável aprovados. Advisor de segurança sem findings; performance só informa índices ainda sem uso.

## Desbloqueio e aceitação restante

Implantar `challenge-decisions` usando `web/decisions/index.ts`, `web/decisions/deno.json` e `web/domain/decision_scope.mjs`. Alternativa de pacote único gerado, sem duplicação manual de regras:

```sh
python scripts/build_decision_edge.py --output .work/decision-edge/index.ts
```

A função exige a capacidade própria e usa os segredos internos padrão do runtime; verify_jwt=false acompanha o acesso livre autorizado. Depois da implantação, executar `python web/tests/http_scopes.py` (sem escrita por padrão), validar uma decisão `[QA]` com `--write-qa` quando houver intenção de persistir o teste, e publicar o frontend somente após êxito. O script de empacotamento foi executado; o teste HTTP novo ainda não passou. Nenhuma PR/review foi aberta.
