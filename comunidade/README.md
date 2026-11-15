# Comunidade — Casa dos MBTIs

Módulo independente publicado em `/comunidade/`.

## Objetivo
Reunir em uma única interface o fórum de discussões, o mural público de sugestões, a central privada de avaliações e ferramentas administrativas.

## Arquitetura
- `index.html`: estrutura da aplicação de página única.
- `css/`: tokens visuais, base, layout, componentes e estilos por funcionalidade.
- `js/core/`: conexão Supabase, autenticação, navegação e permissões.
- `js/shared/`: utilitários, validação e notificações.
- `js/features/`: módulos independentes do fórum, sugestões, avaliações e administração.
- `../supabase/migrations/`: alterações versionadas no banco.

## Integração existente
A aplicação reutiliza o Supabase já usado pelo site. A consulta de perfil usa apenas os campos necessários à identidade: `id`, `nome`, `username`, `avatar_url`, `avatar_tipo` e `cargo`. A nova área não consulta campos VIP.

- Visitante: vê o botão Login.
- Usuário autenticado: vê o avatar, que leva ao `/FEED/`.
- A sessão continua sendo gerenciada pelo Supabase Auth já utilizado pelo site.

## Estado desta primeira etapa
A base visual, navegação, autenticação inicial e estrutura modular estão preparadas. Fórum, votos, envio e acompanhamento de avaliações e moderação ainda não gravam dados. Essas operações só serão ativadas depois da revisão do schema, das políticas RLS e das funções necessárias.

## Regras para futuras alterações
1. Alterar somente o módulo responsável pela funcionalidade.
2. Manter as regras de acesso no banco; esconder controles na interface não é proteção.
3. Criar migrações SQL incrementais e versionadas.
4. Não remover tabelas, colunas ou funções sem mapear dependências.
5. Não armazenar o código de acompanhamento em texto aberto.
6. Manter a interface desacoplada da lógica de dados para facilitar a futura versão Kotlin/Jetpack Compose.

Desenvolvido por Yu — Yasmym, com apoio de IA.