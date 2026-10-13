# Assistente IA — 12/10/2026 (BRT)

O usuário aprovou assistente de consultas com histórico e escolheu GPT-6 Luna por custo. Pediu orientação para cadastrar o Secret no próprio Supabase; código continua no fork, sem PR. O Codex recuperou o padrão do Pantanal e consultou documentação oficial OpenAI/Supabase. Nenhuma chave foi recebida, extraída, impressa ou versionada.

## TDD e implementação
Testes de domínio foram escritos antes do módulo (falha esperada: módulo ausente); teste SQL antes da migração (RPC ausente); aceitação UI antes do componente (arquivo ausente). Uma Spec adicional mostrou que mensagem sem consulta podia exibir valor inventado: fallback implementado e teste aprovado. Nullable TypeScript encontrado/corrigido. A primeira versão do teste SQL tentou duas consultas na mesma execução e violou a restrição intencional; fixture foi corrigido para usar perguntas distintas, preservando a regra de uma consulta por pergunta. Uma chamada local usou cwd incorreto, foi corrigida sem alterações externas.

Implementados domínio de consultas tipadas, gateway autenticado, tabelas/índices/RLS privados e view de ocorrências completa. Valores vêm de consultas parametrizadas e regras do painel; modelo interpreta e explica com limitações. Contexto pinado, troca explícita, catálogo canônico e reinício de contexto após mudança. UI: sétima área, histórico pesquisável/paginado, rascunho preservado, rename/archive/restore, idempotência e retomada, evidências e acesso ao painel por versão.

## Evidência observada
- Sete Specs de domínio: aprovadas, nenhum skip.
- Vinte componentes e nove adaptadores: aprovados (29 testes, DOM/API/Auth/provedor simulados). Total executado nesta aceitação: 36 JS. Nenhuma afirmação de browser QA ou chamada real OpenAI.
- TypeScript frontend/site e builds Vite/Vinext aprovados; pacote Edge passa node --check.
- Duas migrações aplicadas: assistant_history_and_business_tools e assistant_version_filter_catalog.
- SQL real, service_role, com sessão/Auth existentes e rollback: nove métricas, MRR igual ao snapshot, ARR anualizado igual a doze vezes MRR, contagem de cadastros e deduplicação por conta, contrato sem SQL livre, replay sem duplicação, atualização de contexto, isolamento de outro usuário e browser sem privilégios. Nenhuma identidade/sessão Auth fictícia criada, nenhum QA persistido.
- HTTP real: status, histórico e pergunta anônimos rejeitados com 401.
- Advisor: nenhuma advertência nova do assistente; persiste aviso anterior sobre proteção Auth contra senhas vazadas desativada.
- Estado de negócio preservado: versão ativa 7d8a608b-8a39-4358-9824-7c1f2918367a, duas versões, três decisões e login exigido. Zero conversas/execuções/provedor no momento da conferência; fixtures SQL revertidos.
- Edge challenge-assistant ACTIVE v5, verify_jwt=true. A API verifica somente presença do Secret no runtime autenticado; presença/configuração real ainda não observada nesta aceitação.
- Site v8 publicado com sucesso em 13/10/2026 02:40:26 UTC (12/10/2026 BRT). Fonte 1e31f2f8978392878859d71c5cba8ab457b41397; deployment appgdep_6acd9a0805988191b3547822f9fbc565.

## Limites e entrega
Configuração da chave, disponibilidade/crédito do modelo e chamada real OpenAI ainda não verificados. Proprietário recebeu link direto de Edge Functions Secrets e nome OPENAI_API_KEY; após configurar, deverá testar perguntas, números/evidência e reabertura do histórico. QA visual real segue pendente. O catálogo é definido e limitado, sem promessa de responder toda análise complexa ou reproduzir todas as verificações de qualidade. Histórico pertence ao usuário verificado; nenhum acesso administrativo implícito ao chat de outra pessoa.

Alterações de código e documentação exclusivamente em submissions/joao-paulo-segunda-chance. Fontes brutas, relatórios por conta, builds, credenciais e node_modules não enviados. Nenhuma PR/review/issue/mensagem a avaliadores.
