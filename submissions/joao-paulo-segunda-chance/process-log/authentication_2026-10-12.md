# Process Log — login e identidade (em preparação)

O usuário aprovou e-mail/senha pelo Supabase Auth, com duas contas individuais, administrador e usuário, ambas com todas as funcionalidades. Não definiu ainda os e-mails. Conferidos Supabase Changelog e documentação de Auth, sessões e headers; SDK oficial 2.117.3 consultado no registro npm e fixado com lockfile.

Escrevi testes de identidade antes do módulo: vermelho por módulo ausente; depois dois casos aprovados. O teste SQL inicial sem alterações no Auth falhou por RPC ausente; migração `authenticated_identity_and_controlled_activation` aplicada, ativação desligada; guardas SQL passaram com rollback. Nenhum usuário foi criado. A ativação exige exatamente um administrador e um usuário comum configurados e confirmados.

A revisão automática recusou um teste transacional que criaria identidades sintéticas em auth.users/auth.sessions, sem fornecer motivo. Não repeti essa escrita no ambiente compartilhado. Fixture fica identificada como exclusivamente local e NÃO executada/aprovada; teste nativo alternativo não cria identidades e verifica rejeição de sessão desconhecida, privilégio e ativação incompleta.

Login, mostrar senha, erro de credenciais, identificação/saída e bloqueio de carregamento do painel foram implementados. Três testes novos falharam antes da tela; passaram após a implementação. Um fechamento incorreto do callback de sessão foi encontrado por TypeScript e corrigido; não foi publicado código com erro. São 16 casos de componentes em Happy DOM, API/Auth simulados; seis contratos de adaptadores passaram. Não equivalem a login real ou revisão visual.

Backend verifica o JWT com Auth antes de interpretar claims, exige associação ativa e sessão existente, deriva identificador interno estável por HMAC e ignora autor/perfil enviados pelo navegador. Senhas pertencem ao Auth; frontend só tem chave publishable pública. Sessão anônima antiga fica bloqueada quando ativar. Novos autores são preenchidos por trigger; os registros antigos ficam intactos.

Dois adaptadores protegidos foram implantados em paralelo aos antigos: `challenge-auth-web` e `challenge-auth-decisions`, ambos ACTIVE v1, verify_jwt=true. Os antigos continuam servindo a versão pública até contas/testes/ativação/publicação finais. Este é preparo controlado, não declaração de que o site atual já exige login.

Ao perguntar quem eram os registros antigos, o usuário recebeu a conferência real: três decisões QA, autor declarado “QA automatizado (sessão declarada)”, sem usuário autenticado, todas concluídas. Não são decisões do CEO.

Pendências: duas contas reais, vínculos de perfil, teste de login/autoria/logout por HTTP, ativação e atualização do site. Nenhuma PR, review, issue ou mensagem a avaliadores.
