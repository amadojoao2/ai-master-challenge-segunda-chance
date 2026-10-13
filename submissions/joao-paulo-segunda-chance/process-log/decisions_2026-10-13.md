# Decisões de autenticação e uso dos modelos — 13/10/2026

Registro retrospectivo solicitado e aprovado pelo proprietário em 13/10/2026. As motivações abaixo foram informadas por ele; a implementação e as verificações estão vinculadas aos registros das respectivas etapas. Não atribui datas anteriores ou métricas não registradas a essas decisões.

## Autenticação e acesso dos avaliadores

Inicialmente, a proposta era utilizar login com Google como mecanismo de autenticação. Como não havia previsibilidade sobre quais endereços de e-mail seriam utilizados pelos avaliadores, optou-se por autenticação com e-mail e senha pelo Supabase Auth, com provisionamento administrativo de contas.

A escolha buscou maior flexibilidade para disponibilizar acesso a endereços de diferentes provedores, controlar usuários e permissões e facilitar a avaliação. Google pode ser um provedor dentro do Supabase Auth; a decisão do projeto diz respeito ao método de entrada e ao provisionamento das contas, sem exigir login Google. O administrador ainda precisa receber o e-mail do avaliador para cadastrá-lo e entregar as credenciais diretamente.

Durante a evolução houve uma fase intermediária de acesso livre, documentada em [Aplicação web](web_2026-10-12.md). Ela foi substituída pela [preparação](authentication_2026-10-12.md) e [ativação do login](authentication_activation_2026-10-12.md). O proprietário confirmou a aceitação completa do login em 13/10/2026.

Posteriormente, o proprietário aprovou a [gestão de usuários e permissões](user_management_2026-10-13.md): conta proprietária como superadministrador protegido, conta Raven como administrador e permissões explícitas para novos usuários. Determinou permanência no Supabase Free e descartou convites por e-mail. O cadastro direto usa a API administrativa do Auth exclusivamente no servidor; a senha inicial pode ser vista durante a definição e deve ser substituída por senha pessoal antes de acessar os dados. Não há recuperação posterior da senha pelo administrador nem registro de senha no process log.

Essas escolhas permitiram implementar o acesso planejado sem depender de SMTP. A configuração das contas existentes não foi refeita nesta consolidação documental. O novo fluxo de cadastro/redefinição mantém a limitação de aceitação real indicada no [índice](README.md).

## Estratégia de utilização dos modelos de IA

Segundo o relato do proprietário, durante grande parte do desenvolvimento foi utilizado o modelo GPT-6.1 Sol Ultra. A escolha levou em consideração a maior eficiência percebida no consumo de tokens em comparação aos modelos da família Astra em experiências anteriores com projetos semelhantes.

Também foram considerados os limites de utilização disponíveis em sua conta ChatGPT Plus, que, na experiência relatada, não permitiriam manter o uso contínuo dos modelos Astra durante todo o desenvolvimento. Por isso, o proprietário adotou uma distribuição dos modelos conforme a etapa: priorizar GPT-6.1 Sol Ultra para implementação e reservar Astra para revisões finais e auditorias gerais.

O objetivo das revisões era identificar erros, corrigir bugs, aprimorar funcionalidades e melhorar a qualidade geral da solução. Planejamento, mudanças de escopo, escolha de autenticação, aprovações e aceitação permaneceram decisões humanas. Os modelos apoiaram análise, código, testes e documentação; os registros de cada etapa descrevem resultados e correções efetivamente observados.

Essa comparação representa uma observação prática do proprietário, não um benchmark controlado. Não foram registrados percentuais de economia, contagem completa de tokens por modelo ou atribuição individual do modelo a cada commit. A consolidação não inventa essas medições nem apresenta a estratégia como garantia universal de eficiência.

Os modelos usados para desenvolver e revisar o projeto são distintos do modelo integrado à aplicação: o assistente de consultas do RavenStack utiliza GPT-6 Luna, escolhido por custo para o escopo inicial e validado conforme [registro do assistente](assistant_2026-10-12.md).

## Referências de conversa

- [Chat de construção — fornecido pelo proprietário](https://chatgpt.com/share/6ace5036-066c-83e9-b0d3-5e354cafe70c).
- [Chat de revisão — fornecido pelo proprietário](https://chatgpt.com/share/6ace546a-7aa0-83e9-aebf-378e7d694ae7).

São links de compartilhamento do ChatGPT fornecidos pelo proprietário, em substituição aos endereços internos das conversas. A disponibilidade e o conteúdo não foram verificados nesta atualização. O [índice do process log](README.md) e os arquivos do repositório consolidam a evidência escrita disponível à banca.
