# Submissão — João Paulo — Challenge 001 (Segunda Chance)

## Sobre mim

- **Nome:** João Paulo
- **LinkedIn:** https://www.linkedin.com/in/joao-pauloborges
- **Challenge escolhido:** Challenge 001 — Diagnóstico de Churn
- **Estado:** aplicação publicada com login ativo; dois perfis configurados; login integralmente aceito pelo proprietário em 13/10/2026; revisão visual real desta atualização pendente; não enviado para avaliação.

## Executive Summary

A segunda submissão implementa uma mesa de decisão com diagnóstico, atualização por CSV/Excel e ações rastreáveis sobre o Supabase. O acesso exige login, com administrador e usuário comum usando todas as funcionalidades atuais. Cadastro, eventos históricos e contratos são tratados como observações distintas, com limitações explícitas. A entrega prioriza engenharia de dados e critérios defendíveis.

**[Acessar o site](https://challenge-g4-ravenstack.early-hake-5665.chatgpt.site)** · [Aplicação e reprodução](web/README.md) · [Status e limites](docs/web_status.md) · [Diagnóstico executivo](solution/diagnostico_executivo.md).

## Leitura para a banca

1. [Diagnóstico executivo](solution/diagnostico_executivo.md): achados, motivos declarados, prioridades e limites.
2. [Roteiro de demonstração e reprodução](docs/reproduction.md): comandos, dependências, ordem de implantação e limites dos testes.
3. [Implementação da revisão](process-log/review_2026-10-13.md): mudanças e verificação desta rodada.

## Solução

### Abordagem

Preservar DDD, TDD, Clean Architecture, Bounded Contexts e Specifications da primeira entrega. Implementar contratos de dados, versões imutáveis, regras com estado indeterminado e decisões vinculadas a evidências. Ver [plano de implementação](docs/implementation_plan.md), [contratos de dados](docs/data_contracts.md) e [fundação implementada](docs/foundation_status.md).

### Resultados / Findings

Revisão de 13/10/2026: 26 testes Python, 27 testes de domínio/referência web e 36 testes de interface/adaptadores aprovados (89 testes, zero skips). Os 89 resultados de qualidade — uma contagem diferente da quantidade de testes — coincidem entre Python e JavaScript; a revisão também os conferiu no banco. TypeScript e builds portátil/hospedado aprovados; Site v9 publicado. [Registro desta rodada](process-log/review_2026-10-13.md).

Histórico das etapas anteriores: Fundação aplicada no Supabase dedicado: contratos, preservação de fontes, normalização, versões, snapshots, reconciliação e evidências. A primeira versão foi publicada no banco após validação de hashes e contagens. Foram aprovados 26 testes Python e verificações SQL de acesso, imutabilidade, idempotência e falha de publicação. O site está publicado: visão executiva, diagnóstico, contas, decisões/ações, dados/qualidade e metodologia. O importador aceita CSV/.xlsx, valida e publica versões completas após revisão; o teste integral foi primeiro executado com rollback e depois por HTTP com publicação efetiva de uma segunda versão com os mesmos fatos, métricas idênticas e histórico preservado. Foram aprovados também 12 testes de domínio web, oito testes de componentes em DOM emulado, equivalência de 89 resultados com Python, testes SQL e testes HTTP de publicação e decisões. A aceitação encontrou e corrigiu duas mensagens de erro ocultas e um código SQL que provocava retries na API. Fontes e relatórios por conta permanecem fora do repositório. Ver limites em `docs/web_status.md`.

### Recomendações

Fundação e aplicação implementadas. Próxima fase: revisão visual em navegador/celular reais e eventuais ajustes antes da submissão. O diagnóstico traz ações priorizadas, exposição contratual observada e cenário de capacidade; não atribui receita recuperável ou causa raiz sem evidência. Não publicar alertas sustentados por evidências insuficientes nem tratar ausência de evento como ausência comprovada de churn.

### Limitações

Uma maior data observada não comprova completude da extração. Ausência de histórico de mudança impede retroprojetar atributos, e ausência de vínculo entre churn e assinatura limita a atribuição de perda financeira. A auditoria é investigação inicial, não garantia de ausência de outros problemas.

### Evolução de decisões com escopo

Implementados conta, segmento por setor/país, carteira e qualidade com prévia obrigatória, dado principal e população/evidência congeladas. Migração e testes aprovados; adaptador publicado após resolver o empacotamento que provocava erro interno no Supabase. Aceitação HTTP concluída e interface atualizada no site. [Estado, arquitetura e validação](docs/decision_scopes.md).

### Login ativo

Implementado acesso pelo Supabase Auth com administrador e usuário comum, ambos com todas as funções. Duas contas criadas pelo usuário confirmadas e vinculadas a perfis protegidos. Site v6 publicado e autenticação exigida no backend; criação de sessão e acesso pelos endpoints antigos bloqueados. As três decisões QA anteriores e as duas versões de dados foram preservadas. O proprietário informou em 13/10/2026 que concluiu a aceitação completa do login. Essa aceitação é registrada como declaração do proprietário; a revisão não solicitou senha nem repetiu esses fluxos. [Configuração e estado](docs/authentication.md).

### Assistente executivo

Implementado e publicado módulo de perguntas com GPT-6 Luna, consultas tipadas calculadas no banco, evidências por versão e histórico privado por usuário. MRR/ARR, contas, segmentos, qualidade, reconciliação, uso e satisfação têm contratos explícitos; cálculo sem regra e perguntas ambíguas recebem limitação/esclarecimento. Histórico permite busca, retomada, renomear e arquivar. Testes JS/SQL e bloqueios HTTP aprovados; chave e acesso ao GPT-6 Luna validados pelo servidor com fixture sintético. A revisão confirmou uma execução de conversa concluída no backend; isso não substitui uma aceitação completa do assistente no navegador. QA visual desta atualização permanece pendente. [Arquitetura, Secret e reprodução](docs/assistant.md).

## Process Log — Como usei IA

### Ferramentas usadas

| Ferramenta | Para que usou |
|---|---|
| ChatGPT / Codex | Revisão da PR anterior, planejamento, auditoria reproduzível, testes e documentação |

### Workflow

1. Ler a PR #66, comentários e critérios oficiais.
2. Incorporar a decisão do usuário de retirar ML como diferencial.
3. Verificar o projeto Supabase por consulta somente leitura.
4. Inspecionar as cinco fontes e ampliar a reconciliação anterior.
5. Escrever testes de domínio antes da implementação; observar falha inicial.
6. Implementar regras puras e auditoria exploratória; acrescentar testes de integração.
7. Executar auditoria e suíte; documentar a arquitetura e versionar o código no fork, sem PR.
8. Aplicar contratos e migrações, carregar fontes, testar permissões e publicar uma versão completa.
9. Implementar acesso livre, site, importador e operações; comparar auditorias, validar publicação com rollback e publicar o site.

### Onde a IA errou e como corrigi

O usuário reforçou a diferença entre ausência de qualquer evento e ausência de evento de cancelamento. A auditoria passou a distinguir essas populações, incluindo contas que possuem apenas reativação. Também evita classificar automaticamente divergência entre histórico e cadastro como erro da fonte. Na fase web, o primeiro contrato de timestamp rejeitava datas sem horário presentes na fonte; foi alinhado ao contrato Python. O teste de nova versão revelou um plano SQL lento, corrigido com evidência de EXPLAIN e configuração restrita à função analítica.

### O que eu adicionei que a IA sozinha não faria

O usuário definiu que o site permita decisões e atualizações, retirou ML como diferencial, exigiu continuidade dos princípios arquiteturais e reforçou a lacuna já encontrada na primeira tentativa. Também estabeleceu versionamento contínuo no GitHub, com revisão somente quando a entrega estiver pronta.

## Evidências

- [Registro parcial desta sessão](process-log/session_2026-10-12.md).
- [Implementação da fundação](process-log/foundation_2026-10-12.md).
- [Implementação web e resultados de testes](process-log/web_2026-10-12.md).
- [Aceitação efetiva, correções e evidências](process-log/acceptance_2026-10-12.md).
- [Implementação e aceitação dos escopos](process-log/decision_scopes_2026-10-12.md).
- [Implementação do login e limites de validação](process-log/authentication_2026-10-12.md).
- [Ativação do login e verificação dos bloqueios](process-log/authentication_activation_2026-10-12.md).
- [Reorganização do contexto da visão executiva](process-log/executive_layout_2026-10-12.md).
- [Implementação e validação do assistente](process-log/assistant_2026-10-12.md).
- [Conferência dos requisitos oficiais](docs/submission_readiness.md).
- Scripts, testes com dados sintéticos e histórico de commits desta branch.
- Narrativa escrita e histórico Git fornecidos, formatos aceitos pelo guia oficial. Screenshots/gravação/export não foram fornecidos, são alternativas opcionais e não são simulados.

## Reproduzir a auditoria

Requer Python 3.12. Obtenha as cinco fontes CSV do dataset especificado no [desafio oficial](../../challenges/data-001-churn/README.md) e coloque-as em uma pasta local. Para reproduzir os resultados de uma rodada específica, use os arquivos exatos identificados pelo manifesto daquela rodada.

```bash
python -m pip install -r requirements-audit.txt
python -m unittest discover -s tests -v
python scripts/audit_data.py --data-dir /caminho/para/os/csv --output-dir reports
```

O adaptador de auditoria usa pandas; o domínio não depende de pandas. Os relatórios gerados são ignorados pelo Git para evitar publicação acidental de IDs, linhas de origem e dados derivados. O código não modifica os arquivos de entrada.

_Atualizado em: 13/10/2026. Submissão ainda não enviada._

