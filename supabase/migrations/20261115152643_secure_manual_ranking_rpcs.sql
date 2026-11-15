-- Admin-only ranking RPCs are no longer callable by anonymous users.
-- Each function still verifies cargo='adm' using usuario_pode_gerenciar_ranking().
revoke all on function public.adicionar_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.definir_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.remover_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.remover_membro_ranking(uuid, text) from public, anon;

grant execute on function public.adicionar_pontos_ranking(uuid, integer, text) to authenticated;
grant execute on function public.definir_pontos_ranking(uuid, integer, text) to authenticated;
grant execute on function public.remover_pontos_ranking(uuid, integer, text) to authenticated;