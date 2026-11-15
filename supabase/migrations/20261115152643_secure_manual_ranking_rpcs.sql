-- Apenas membros autenticados podem chamar os RPCs administrativos.
-- Cada função verifica usuario_pode_gerenciar_ranking(), que exige cargo='adm'.
revoke all on function public.adicionar_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.definir_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.remover_pontos_ranking(uuid, integer, text) from public, anon;
revoke all on function public.remover_membro_ranking(uuid, text) from public, anon;

grant execute on function public.adicionar_pontos_ranking(uuid, integer, text) to authenticated;
grant execute on function public.definir_pontos_ranking(uuid, integer, text) to authenticated;
grant execute on function public.remover_pontos_ranking(uuid, integer, text) to authenticated;
grant execute on function public.remover_membro_ranking(uuid, text) to authenticated;