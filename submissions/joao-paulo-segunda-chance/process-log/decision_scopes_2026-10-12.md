# Process Log — escopo de decisão

Registro parcial e verificável de uso de ChatGPT/Codex; não é export integral da conversa.

## Orientação humana
O usuário pediu que “Registrar decisão” permita escolher sobre qual dado decidir, por exemplo conta ou setor. Após o planejamento, autorizou implementar. Mantidos DDD, TDD, Clean Architecture, Bounded Contexts e Specifications, acesso livre, GitHub contínuo e nenhuma PR antes de nova autorização.

## Desenvolvimento e testes
Escrevi testes de escopo antes do módulo: falharam por módulo ausente; implementei o value object. Testes SQL sintéticos falharam antes da migração por função inexistente. Após aplicar `explicit_decision_scopes_and_frozen_evidence`, passaram, com rollback para não mudar painel/dados nem persistir QA. Testes do formulário anterior falharam para o fluxo novo; foram satisfeitos pela implementação.

Não refiz os critérios temporais: usei snapshots existentes para conta/segmento/carteira. Diferenciei população de casos destacados. Qualidade mantém seu denominador original e não recebe membros inventados. Adicionei prévia calculada no banco, hash recomposto ao salvar, transação com escopo/membros/ação/histórico, proteção da versão ativa e compatibilidade com registros anteriores.

Uma revisão adicional encontrou que JavaScript aceitava `type:['account']` por coerção da chave: novo teste reproduziu a falha e foi corrigido para exigir string. No teste de FK entre versões, o fixture inicialmente reutilizava um snapshot já vinculado e disparava unicidade antes da FK; ajustei para outra conta, comprovando então a FK pretendida. Nenhuma alteração de regra foi feita para esconder falha.

Foram aprovados seis testes do escopo, 13 de componentes, quatro de adaptadores, os 12 testes web anteriores (incluindo comparação de 89 verificações com Python) e o SQL transacional. A suíte Python anterior tinha 26 testes aprovados; não atribuo uma nova execução a esta etapa. Componentes usam Happy DOM 21.0.1, com API simulada; adaptadores usam fetch simulado, não browser nem Supabase real.

Consultas reais conferiram o recorte FinTech (112 contas e 12 casos sem cancelamento), notas ponderadas/cobertura, MRR e uso. Advisor de segurança retornou zero findings; performance apenas índices sem uso. Capacidade/token/chaves e dados por conta não entram no GitHub.

## Bloqueio observado na publicação
A atualização do `challenge-web` retornou `InternalServerErrorException`, “Function deploy failed due to an internal error”, em duas tentativas. A versão 4 permaneceu ACTIVE. Não atribuí causa sem evidência: consulta de logs também falhou no backend.

Separei o adaptador de decisões do importador Excel: três operações fixas, sem pacote externo, usando a mesma capacidade e RPCs restritas. A implantação da nova `challenge-decisions` também falhou. Consultei a documentação oficial e gerei um pacote de arquivo único a partir do mesmo módulo, sem dependências relativas; a tentativa também teve o mesmo erro. Isso não prova indisponibilidade global, erro de sintaxe ou limite de tamanho.

[Guia oficial para esse erro](https://supabase.com/docs/guides/troubleshooting/edge-function-fails-deploy) recomenda CLI com debug/método de bundle alternativo ou suporte. CLI autenticada não está disponível nesta execução. Não extraí credenciais, abri ticket ou afrouxei RLS para contornar o bloqueio. O código e o empacotador ficam revisáveis no fork. Não publiquei uma interface que exigiria um backend ainda indisponível.

## Estado honesto
Migração e testes SQL concluídos. Formulário/lista/histórico e adaptador implementados. Publicação e HTTP efetivo do novo fluxo pendentes; site público anterior continua ativo. Revisão visual real continua pendente. Nenhuma PR, issue, review, ticket ou mensagem a avaliadores foi criada.
