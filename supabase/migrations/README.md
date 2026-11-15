# Migrações do Supabase

## Estado da Comunidade

A fundação da nova Comunidade foi aplicada ao projeto Supabase `lhhoqahzpuohhhnbwgfp` em 15/11/2026.

- 10 tabelas criadas com RLS habilitado.
- Políticas de leitura pública e escrita autenticada configuradas para fórum e sugestões.
- Denúncias, avaliações privadas e logs administrativos restritos.
- Administração identificada por `profiles.cargo = 'adm'`.
- Envio e consulta de avaliações por código aleatório com hash SHA-256.
- Status inicial das sugestões criado automaticamente.

## Próximos passos

1. Exportar e revisar o SQL aplicado para manter uma migração reproduzível neste diretório.
2. Adicionar limitação de tentativas e proteção anti-spam para RPCs públicas de avaliação.
3. Conectar o fórum e o mural de sugestões ao frontend.
4. Implementar o painel administrativo e testar os fluxos com visitante, membro e administrador.

Não remover campos VIP nem objetos antigos do banco sem auditoria independente de dependências.
