# Process log — percurso da segunda chance

Consolidado em 13/10/2026, horário de Brasília. Este índice reúne as decisões humanas, o uso de IA, as implementações, os problemas encontrados e as evidências da segunda submissão. Os registros de cada etapa conservam o estado observado quando foram escritos; as notas posteriores e este índice esclarecem o estado atual.

## Objetivo e decisões

A proposta evoluiu de uma auditoria do diagnóstico de churn para uma mesa de decisão: leitura executiva, investigação por conta, decisões com evidência, atualização por CSV/Excel e assistente de consultas. O proprietário retirou ML como diferencial, preservou os princípios de arquitetura da primeira entrega e exigiu que as conclusões respeitassem as limitações das fontes.

As decisões sobre autenticação e distribuição dos modelos de IA estão em [Decisões de autenticação e uso dos modelos](decisions_2026-10-13.md). A implementação final usa e-mail/senha pelo Supabase Auth, gestão administrativa de usuários e permissões, sem convites por e-mail e mantendo o plano Free. O login das contas existentes foi integralmente aceito pelo proprietário em 13/10/2026.

## Conversas de desenvolvimento e revisão

Links fornecidos pelo proprietário em 13/10/2026:

- [Conversa de construção do projeto](https://chatgpt.com/share/6ace5036-066c-83e9-b0d3-5e354cafe70c).
- [Conversa de revisão do projeto](https://chatgpt.com/share/6ace546a-7aa0-83e9-aebf-378e7d694ae7).

São links de compartilhamento do ChatGPT fornecidos pelo proprietário para a banca, substituindo os endereços internos das conversas. A disponibilidade e o conteúdo dos links não foram verificados nesta atualização. A narrativa e as evidências presentes no repositório permitem acompanhar o processo independentemente dos links; não se apresentam como export integral do chat.

## Etapas e evidências

| Ordem | Etapa | Entrega e registro |
|---|---|---|
| 1 | Reavaliação e auditoria | Leitura da PR anterior e do desafio; distinção entre ausência de qualquer evento e ausência de cancelamento; investigação das cinco fontes. [Registro inicial](session_2026-10-12.md). |
| 2 | Fundação de dados | Contratos, preservação de origem, normalização, versões, snapshots, imutabilidade e acesso. [Fundação](foundation_2026-10-12.md). |
| 3 | Aplicação web | Painel, detalhe de conta, importação com prévia, decisões e ações. [Implementação web](web_2026-10-12.md). |
| 4 | Aceitação de importação e ações | Publicação efetiva da segunda versão com os mesmos fatos; correção de mensagens e conflito SQL. [Aceitação](acceptance_2026-10-12.md) e [evidências](evidence/acceptance_results.json). |
| 5 | Escopos de decisão | Conta, segmento, carteira e qualidade; prévia e evidência congelada; recuperação de implantação. [Escopos](decision_scopes_2026-10-12.md) e [evidências](evidence/decision_scope_results.json). |
| 6 | Preparação de autenticação | SDK, identidade, autoria e bloqueio das rotas antigas. [Preparação](authentication_2026-10-12.md) e [evidências](evidence/authentication_results.json). |
| 7 | Ativação do login | Associação das duas contas reais, Site v6 e exigência de autenticação. [Ativação e aceite posterior](authentication_activation_2026-10-12.md) e [evidências](evidence/authentication_activation_results.json). |
| 8 | Organização da visão executiva | Contexto da versão e comparação antes dos filtros; Site v7. [Layout](executive_layout_2026-10-12.md). |
| 9 | Assistente de consultas | Consultas tipadas, histórico privado, limites e diagnóstico real do provedor; Site v8. [Assistente](assistant_2026-10-12.md) e [evidências](evidence/assistant_results.json). |
| 10 | Revisão geral | Recuperação de conexão, exploração de evidências, tickets, leitura executiva, legibilidade e diagnóstico; Site v9. [Revisão](review_2026-10-13.md). |
| 11 | Usuários e permissões | Superadministrador protegido, administrador, permissões, senha inicial e troca obrigatória; Site v10. [Gestão de usuários](user_management_2026-10-13.md). |
| 12 | Consolidação documental | Índice, decisões de autenticação/modelos, links das conversas e notas posteriores sobre login e formatos de evidência. Este índice e [decisões](decisions_2026-10-13.md). |

## Problemas encontrados e correções

Os registros detalham testes que falharam antes ou durante a implementação e a verificação após as correções. Exemplos relevantes:

- A interpretação inicial de churn não separava adequadamente ausência de eventos de ausência de cancelamento. A orientação humana levou à distinção das populações e à preservação do estado indeterminado.
- O parser web rejeitava datas sem horário presentes no suporte. Foi alinhado ao contrato Python; os 89 resultados de qualidade tiveram contagens e denominadores comparados.
- A materialização de uma versão recém-carregada apresentava plano SQL lento. A análise de EXPLAIN orientou ajustes restritos à função, preservando os fatos e o ponteiro ativo até a publicação.
- Um conflito de revisão usava SQLSTATE 40001 e gerava retries pelo PostgREST. Passou a usar PT409/HTTP 409, com novo teste e aceitação HTTP.
- Erros de ação ficavam atrás do modal e o detalhe de conta permanecia carregando após falhar. Testes de componentes reproduziram e confirmaram as correções.
- A implantação dos escopos falhou com erro interno. O empacotamento canônico em JavaScript foi aceito; a causa interna não foi presumida.
- A revisão final melhorou recuperação do assistente, filtros de exploração, tickets, denominadores e legibilidade. A gestão de usuários acrescentou autorização no servidor e remoção de dados não permitidos das respostas.

## Validação por etapa

As quantidades abaixo pertencem às respectivas rodadas. Não devem ser somadas como testes únicos: várias suítes foram ampliadas e reexecutadas ao longo do projeto. As 89 verificações de qualidade são resultados da auditoria e não representam a quantidade de testes de software.

| Etapa | Verificação registrada | Alcance |
|---|---|---|
| Auditoria inicial | 17 testes Python | Domínio/integração local com fontes sintéticas e auditoria das fontes fornecidas. |
| Fundação | 26 testes Python e guardas SQL | Contratos, publicação, idempotência, imutabilidade e acesso, conforme registro da etapa. |
| Aceitação web | 26 Python + 12 domínio web + 8 componentes | 46 testes dessas suítes; SQL/HTTP separados. Importação e ações QA exercitadas por HTTP real. |
| Escopos | 18 domínio web + 13 componentes + 4 adaptadores | Testes locais e SQL com rollback; leitura e gravação QA verificadas por HTTP. |
| Preparação do login | 20 domínio web + 17 componentes + 6 adaptadores | Auth/API simulados nos componentes; bloqueios reais por SQL/HTTP. |
| Login existente | Aceitação completa informada pelo proprietário em 13/10/2026 | Declaração humana posterior à ativação; não é nova execução observada pelo agente. |
| Layout executivo | 17 componentes + 6 adaptadores e builds | 23 testes; conferência de fonte, sem revisão visual real. |
| Assistente | 7 Specs + 20 componentes + 9 adaptadores | 36 testes JS nessa aceitação; SQL real com rollback e bloqueios HTTP. Diagnóstico do provedor: quatro respostas reais com fixture sintético; não é conversa integral de CEO. |
| Revisão geral | 26 Python + 27 domínio/referência web + 36 componentes/adaptadores | 89 testes aprovados, zero skips; comparação dos 89 resultados de qualidade com o banco. |
| Gestão de usuários | 47 componentes/adaptadores, SQL isolado e 4 guardas HTTP | Zero falhas/skips; SQL em PGlite local e preflight real com rollback. Cadastro/redefinição HTTP com conta legítima ainda não exercitados. |

Componentes em Happy DOM e adaptadores com API simulada não equivalem a navegador real. O SQL local de gestão de usuários cria somente identidades sintéticas em memória; suas fixtures não devem ser aplicadas no Supabase compartilhado. Comandos e dependências em [Reprodução](../docs/reproduction.md) e [Gestão de usuários](../docs/user_management.md).

## Estado e limites para a avaliação

- [Site v10 publicado](https://challenge-g4-ravenstack.early-hake-5665.chatgpt.site/), com login ativo; dados e duas versões publicadas preservados.
- Login das contas existentes concluído por aceite do proprietário. Cadastro/redefinição e primeiro acesso do novo módulo ainda precisam de validação integral com conta legítima.
- Revisão visual em desktop/celular reais não executada pelo agente; DOM e builds não a substituem. A aceitação integral do assistente no navegador também não foi registrada como concluída.
- Ausência de eventos ou telemetria não é automaticamente zero; exposição contratual não é perda prevista ou caixa; causa raiz e receita recuperável não são afirmadas sem evidência.
- Narrativa escrita e histórico Git são os formatos de evidência adotados. Screenshots, gravação e export integral são alternativas opcionais, conforme [conferência do guia](../docs/submission_readiness.md).
- Alterações restritas à pasta e branch da segunda chance. A PR continua não aberta por orientação do proprietário.

## Consolidação de 13/10/2026

O proprietário aprovou as mudanças documentais e forneceu os links das conversas de construção e revisão. A atualização acrescenta este índice e o registro das decisões, completa o README e anota desdobramentos nos registros históricos sem substituir resultados observados na época. A comparação de eficiência entre modelos é atribuída ao relato do proprietário, sem benchmark inventado ou medição retroativa de tokens.

A conferência desta rodada é documental: referências locais, consistência de estados e escopo dos arquivos no GitHub. Não representa nova execução dos testes de aplicação ou alteração da plataforma.
