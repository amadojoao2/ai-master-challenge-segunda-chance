# Submissão — João Paulo — Challenge 001 (Segunda Chance)

## Sobre mim

- **Nome:** João Paulo
- **LinkedIn:** https://www.linkedin.com/in/joao-pauloborges
- **Challenge escolhido:** Challenge 001 — Diagnóstico de Churn
- **Estado:** em desenvolvimento; não enviado para avaliação.

## Executive Summary

A segunda submissão propõe um site de diagnóstico e decisões, atualizado por CSV/Excel, com dados e histórico no Supabase. A prioridade é preservar e reconciliar as fontes antes de produzir recomendações. O produto deverá distinguir cadastro, eventos históricos e intervalos contratuais, com limitações explícitas. Modelos preditivos não serão o diferencial da entrega.

## Solução

### Abordagem

Preservar DDD, TDD, Clean Architecture, Bounded Contexts e Specifications da primeira entrega. Implementar contratos de dados, versões imutáveis, regras com estado indeterminado e decisões vinculadas a evidências. Ver [plano de implementação](docs/implementation_plan.md) e [contratos de dados](docs/data_contracts.md).

### Resultados / Findings

Nesta etapa foram preparados um auditor somente leitura, regras puras de referência e 17 testes executados com sucesso. Resultados detalhados das fontes foram entregues separadamente ao usuário; não são publicados nesta branch. O site e a ingestão Supabase ainda não estão implementados. Findings de negócio serão incorporados à entrega final após validação e autorização apropriada de divulgação.

### Recomendações

Primeiro implementar a fundação de dados e validar os indicadores. Depois construir diagnóstico, decisões e acompanhamento. Não publicar alertas sustentados por evidências insuficientes nem tratar ausência de evento como ausência comprovada de churn.

### Limitações

Uma maior data observada não comprova completude da extração. Ausência de histórico de mudança impede retroprojetar atributos, e ausência de vínculo entre churn e assinatura limita a atribuição de perda financeira. A auditoria é investigação inicial, não garantia de ausência de outros problemas.

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

### Onde a IA errou e como corrigi

O usuário reforçou a diferença entre ausência de qualquer evento e ausência de evento de cancelamento. A auditoria passou a distinguir essas populações, incluindo contas que possuem apenas reativação. Também evita classificar automaticamente divergência entre histórico e cadastro como erro da fonte.

### O que eu adicionei que a IA sozinha não faria

O usuário definiu que o site permita decisões e atualizações, retirou ML como diferencial, exigiu continuidade dos princípios arquiteturais e reforçou a lacuna já encontrada na primeira tentativa. Também estabeleceu versionamento contínuo no GitHub, com revisão somente quando a entrega estiver pronta.

## Evidências

- [Registro parcial desta sessão](process-log/session_2026-10-12.md).
- Scripts, testes com dados sintéticos e histórico de commits desta branch.
- Exports integrais e evidências visuais: pendentes para a entrega final. O registro escrito não se apresenta como export integral.

## Reproduzir a auditoria

Requer Python 3.12. Obtenha as cinco fontes CSV do dataset especificado no [desafio oficial](../../challenges/data-001-churn/README.md) e coloque-as em uma pasta local. Para reproduzir os resultados de uma rodada específica, use os arquivos exatos identificados pelo manifesto daquela rodada.

```bash
python -m pip install -r requirements-audit.txt
python -m unittest discover -s tests -v
python scripts/audit_data.py --data-dir /caminho/para/os/csv --output-dir reports
```

O adaptador de auditoria usa pandas; o domínio não depende de pandas. Os relatórios gerados são ignorados pelo Git para evitar publicação acidental de IDs, linhas de origem e dados derivados. O código não modifica os arquivos de entrada.

_Atualizado em: 12/10/2026. Submissão ainda não enviada._

