-- Reject an empty or null game identifier instead of silently ignoring the score.
create or replace function public.submit_game_score(
    p_game_id text,
    p_score integer,
    p_character_id text default null
)
returns void
language plpgsql
security definer
set search_path to pg_catalog, public, auth
as $function$
declare
    v_user_id uuid := auth.uid();
begin
    if v_user_id is null then
        raise exception 'É necessário entrar na conta para salvar a pontuação.' using errcode = '28000';
    end if;
    if p_score is null or p_score < 0 or p_score > 100000 then
        raise exception 'Pontuação inválida.' using errcode = '22023';
    end if;
    if p_game_id is null or p_game_id not in ('sp7_run', 'asas_do_caos', 'mbti_jump') then
        raise exception 'Jogo inválido.' using errcode = '22023';
    end if;

    if p_game_id = 'sp7_run' then
        if p_character_id is not null then
            raise exception 'SP7 Run não utiliza personagem no registro de pontuação.' using errcode = '22023';
        end if;
        insert into public.game_rankings (user_id, sp7_run_best_score, sp7_run_total_points, sp7_run_games_played, updated_at)
        values (v_user_id, p_score, p_score, 1, now())
        on conflict (user_id) do update set
            sp7_run_best_score = greatest(public.game_rankings.sp7_run_best_score, excluded.sp7_run_best_score),
            sp7_run_total_points = public.game_rankings.sp7_run_total_points + excluded.sp7_run_total_points,
            sp7_run_games_played = public.game_rankings.sp7_run_games_played + 1,
            updated_at = now();
    elsif p_game_id = 'asas_do_caos' then
        if p_character_id is null or p_character_id not in ('sp7','so2','so7','sp5','so5','sx9','sx7') then
            raise exception 'Personagem inválido para Asas do Caos.' using errcode = '22023';
        end if;
        insert into public.game_rankings (user_id, asas_do_caos_best_score, asas_do_caos_total_points, asas_do_caos_games_played, asas_do_caos_character_id, updated_at)
        values (v_user_id, p_score, p_score, 1, p_character_id, now())
        on conflict (user_id) do update set
            asas_do_caos_best_score = greatest(public.game_rankings.asas_do_caos_best_score, excluded.asas_do_caos_best_score),
            asas_do_caos_total_points = public.game_rankings.asas_do_caos_total_points + excluded.asas_do_caos_total_points,
            asas_do_caos_games_played = public.game_rankings.asas_do_caos_games_played + 1,
            asas_do_caos_character_id = case when excluded.asas_do_caos_best_score > public.game_rankings.asas_do_caos_best_score then excluded.asas_do_caos_character_id else public.game_rankings.asas_do_caos_character_id end,
            updated_at = now();
    elsif p_game_id = 'mbti_jump' then
        if p_character_id is null or p_character_id not in ('sp7','so7','so5','so2','sx7','sx9') then
            raise exception 'Personagem inválido para MBTI Jump.' using errcode = '22023';
        end if;
        insert into public.game_rankings (user_id, mbti_jump_best_score, mbti_jump_total_points, mbti_jump_games_played, mbti_jump_character_id, updated_at)
        values (v_user_id, p_score, p_score, 1, p_character_id, now())
        on conflict (user_id) do update set
            mbti_jump_best_score = greatest(public.game_rankings.mbti_jump_best_score, excluded.mbti_jump_best_score),
            mbti_jump_total_points = public.game_rankings.mbti_jump_total_points + excluded.mbti_jump_total_points,
            mbti_jump_games_played = public.game_rankings.mbti_jump_games_played + 1,
            mbti_jump_character_id = case when excluded.mbti_jump_best_score > public.game_rankings.mbti_jump_best_score then excluded.mbti_jump_character_id else public.game_rankings.mbti_jump_character_id end,
            updated_at = now();
    end if;
end;
$function$;

revoke all on function public.submit_game_score(text, integer, text) from public, anon;
grant execute on function public.submit_game_score(text, integer, text) to authenticated;