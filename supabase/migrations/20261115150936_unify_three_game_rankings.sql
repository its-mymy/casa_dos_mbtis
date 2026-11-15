-- Migration already applied to Supabase project lhhoqahzpuohhhnbwgfp.
-- Consolidates SP7 Run, Asas do Caos and MBTI Jump without deleting legacy data.

create table if not exists public.game_rankings (
    user_id uuid primary key references public.profiles(id) on delete cascade,
    sp7_run_best_score integer not null default 0 check (sp7_run_best_score between 0 and 100000),
    sp7_run_total_points bigint not null default 0 check (sp7_run_total_points >= 0),
    sp7_run_games_played integer not null default 0 check (sp7_run_games_played >= 0),
    asas_do_caos_best_score integer not null default 0 check (asas_do_caos_best_score between 0 and 100000),
    asas_do_caos_total_points bigint not null default 0 check (asas_do_caos_total_points >= 0),
    asas_do_caos_games_played integer not null default 0 check (asas_do_caos_games_played >= 0),
    asas_do_caos_character_id text,
    mbti_jump_best_score integer not null default 0 check (mbti_jump_best_score between 0 and 100000),
    mbti_jump_total_points bigint not null default 0 check (mbti_jump_total_points >= 0),
    mbti_jump_games_played integer not null default 0 check (mbti_jump_games_played >= 0),
    mbti_jump_character_id text,
    total_points bigint generated always as (sp7_run_total_points + asas_do_caos_total_points + mbti_jump_total_points) stored,
    games_played integer generated always as (sp7_run_games_played + asas_do_caos_games_played + mbti_jump_games_played) stored,
    updated_at timestamptz not null default now(),
    constraint game_rankings_asas_character_check
        check (asas_do_caos_character_id is null or asas_do_caos_character_id in ('sp7','so2','so7','sp5','so5','sx9','sx7')),
    constraint game_rankings_mbti_character_check
        check (mbti_jump_character_id is null or mbti_jump_character_id in ('sp7','so7','so5','so2','sx7','sx9'))
);

create index if not exists game_rankings_total_points_idx on public.game_rankings (total_points desc, updated_at asc);

with player_ids as (
    select user_id from public.sp7_run_scores
    union select user_id from public.sp7_flappy_scores
    union select user_id from public.mbti_jump_scores
)
insert into public.game_rankings (
    user_id,
    sp7_run_best_score, sp7_run_total_points, sp7_run_games_played,
    asas_do_caos_best_score, asas_do_caos_total_points, asas_do_caos_games_played, asas_do_caos_character_id,
    mbti_jump_best_score, mbti_jump_total_points, mbti_jump_games_played, mbti_jump_character_id,
    updated_at
)
select
    ids.user_id,
    coalesce(run.best_score, 0), coalesce(run.total_points, 0), coalesce(run.games_played, 0),
    coalesce(asas.best_score, 0), coalesce(asas.total_points, 0), coalesce(asas.games_played, 0), asas.character_id,
    coalesce(jump.best_score, 0), coalesce(jump.total_points, 0), coalesce(jump.games_played, 0), jump.character_id,
    greatest(
        coalesce(run.updated_at, '-infinity'::timestamptz),
        coalesce(asas.updated_at, '-infinity'::timestamptz),
        coalesce(jump.updated_at, '-infinity'::timestamptz)
    )
from player_ids ids
left join public.sp7_run_scores run on run.user_id = ids.user_id
left join public.sp7_flappy_scores asas on asas.user_id = ids.user_id
left join public.mbti_jump_scores jump on jump.user_id = ids.user_id
on conflict (user_id) do update set
    sp7_run_best_score = excluded.sp7_run_best_score,
    sp7_run_total_points = excluded.sp7_run_total_points,
    sp7_run_games_played = excluded.sp7_run_games_played,
    asas_do_caos_best_score = excluded.asas_do_caos_best_score,
    asas_do_caos_total_points = excluded.asas_do_caos_total_points,
    asas_do_caos_games_played = excluded.asas_do_caos_games_played,
    asas_do_caos_character_id = excluded.asas_do_caos_character_id,
    mbti_jump_best_score = excluded.mbti_jump_best_score,
    mbti_jump_total_points = excluded.mbti_jump_total_points,
    mbti_jump_games_played = excluded.mbti_jump_games_played,
    mbti_jump_character_id = excluded.mbti_jump_character_id,
    updated_at = excluded.updated_at;

alter table public.game_rankings enable row level security;
revoke all on table public.game_rankings from public, anon, authenticated;
grant select on table public.game_rankings to anon, authenticated;

drop policy if exists "Public can read combined game ranking" on public.game_rankings;
create policy "Public can read combined game ranking"
on public.game_rankings for select to anon, authenticated using (true);

create or replace view public.game_leaderboard
with (security_invoker = true)
as
select
    scores.user_id, profiles.nome, profiles.username, profiles.avatar_url, profiles.avatar_tipo,
    scores.total_points, scores.games_played,
    scores.sp7_run_best_score, scores.sp7_run_total_points, scores.sp7_run_games_played,
    scores.asas_do_caos_best_score, scores.asas_do_caos_total_points, scores.asas_do_caos_games_played,
    scores.asas_do_caos_character_id,
    scores.mbti_jump_best_score, scores.mbti_jump_total_points, scores.mbti_jump_games_played,
    scores.mbti_jump_character_id, scores.updated_at
from public.game_rankings scores
join public.profiles profiles on profiles.id = scores.user_id;

grant select on public.game_leaderboard to anon, authenticated;

create or replace function public.submit_game_score(
    p_game_id text, p_score integer, p_character_id text default null
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
            asas_do_caos_character_id = case
                when excluded.asas_do_caos_best_score > public.game_rankings.asas_do_caos_best_score then excluded.asas_do_caos_character_id
                else public.game_rankings.asas_do_caos_character_id end,
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
            mbti_jump_character_id = case
                when excluded.mbti_jump_best_score > public.game_rankings.mbti_jump_best_score then excluded.mbti_jump_character_id
                else public.game_rankings.mbti_jump_character_id end,
            updated_at = now();
    end if;
end;
$function$;

revoke all on function public.submit_game_score(text, integer, text) from public, anon;
grant execute on function public.submit_game_score(text, integer, text) to authenticated;

-- RPCs antigas ficam disponíveis temporariamente para clientes que ainda não foram atualizados.
create or replace function public.submit_sp7_run_score(p_score integer)
returns void language plpgsql security definer
set search_path to pg_catalog, public, auth
as $function$
declare v_user_id uuid := auth.uid();
begin
    if v_user_id is null then raise exception 'É necessário entrar para salvar a pontuação.' using errcode = '28000'; end if;
    if p_score is null or p_score < 0 or p_score > 100000 then raise exception 'Pontuação inválida.' using errcode = '22023'; end if;
    insert into public.sp7_run_scores (user_id, best_score, total_points, games_played, updated_at)
    values (v_user_id, p_score, p_score, 1, now())
    on conflict (user_id) do update set
        best_score = greatest(public.sp7_run_scores.best_score, excluded.best_score),
        total_points = public.sp7_run_scores.total_points + excluded.total_points,
        games_played = public.sp7_run_scores.games_played + 1,
        updated_at = now();
    perform public.submit_game_score('sp7_run', p_score, null);
end;
$function$;

create or replace function public.submit_sp7_flappy_score(p_score integer, p_character_id text)
returns void language plpgsql security definer
set search_path to pg_catalog, public, auth
as $function$
declare v_user_id uuid := auth.uid();
begin
    if v_user_id is null then raise exception 'É necessário estar conectado para salvar a pontuação.' using errcode = '42501'; end if;
    if p_score is null or p_score < 0 or p_score > 100000 then raise exception 'Pontuação inválida.' using errcode = '22023'; end if;
    if p_character_id is null or p_character_id not in ('sp7','so2','so7','sp5','so5','sx9','sx7') then raise exception 'Personagem inválido.' using errcode = '22023'; end if;
    insert into public.sp7_flappy_scores (user_id, best_score, total_points, games_played, character_id, updated_at)
    values (v_user_id, p_score, p_score, 1, p_character_id, now())
    on conflict (user_id) do update set
        best_score = greatest(public.sp7_flappy_scores.best_score, excluded.best_score),
        total_points = public.sp7_flappy_scores.total_points + excluded.total_points,
        games_played = public.sp7_flappy_scores.games_played + 1,
        character_id = case when excluded.best_score > public.sp7_flappy_scores.best_score then excluded.character_id else public.sp7_flappy_scores.character_id end,
        updated_at = now();
    perform public.submit_game_score('asas_do_caos', p_score, p_character_id);
end;
$function$;

create or replace function public.submit_mbti_jump_score(p_score integer, p_character_id text)
returns void language plpgsql security definer
set search_path to pg_catalog, public, auth
as $function$
declare v_user_id uuid := auth.uid();
begin
    if v_user_id is null then raise exception 'É necessário entrar na conta para salvar a pontuação.' using errcode = '42501'; end if;
    if p_score is null or p_score < 0 or p_score > 100000 then raise exception 'Pontuação inválida.' using errcode = '22023'; end if;
    if p_character_id is null or p_character_id not in ('sp7','so7','so5','so2','sx7','sx9') then raise exception 'Personagem inválido.' using errcode = '22023'; end if;
    insert into public.mbti_jump_scores (user_id, best_score, total_points, games_played, character_id, created_at, updated_at)
    values (v_user_id, p_score, p_score, 1, p_character_id, now(), now())
    on conflict (user_id) do update set
        best_score = greatest(public.mbti_jump_scores.best_score, excluded.best_score),
        total_points = public.mbti_jump_scores.total_points + excluded.total_points,
        games_played = public.mbti_jump_scores.games_played + 1,
        character_id = case when excluded.best_score > public.mbti_jump_scores.best_score then excluded.character_id else public.mbti_jump_scores.character_id end,
        updated_at = now();
    perform public.submit_game_score('mbti_jump', p_score, p_character_id);
end;
$function$;

revoke all on function public.submit_sp7_run_score(integer) from public, anon;
revoke all on function public.submit_sp7_flappy_score(integer, text) from public, anon;
revoke all on function public.submit_mbti_jump_score(integer, text) from public, anon;
grant execute on function public.submit_sp7_run_score(integer) to authenticated;
grant execute on function public.submit_sp7_flappy_score(integer, text) to authenticated;
grant execute on function public.submit_mbti_jump_score(integer, text) to authenticated;

create or replace function public.usuario_pode_gerenciar_ranking()
returns boolean language sql stable security definer
set search_path to pg_catalog, public, auth
as $function$
    select exists (
        select 1 from public.profiles
        where id = auth.uid()
          and lower(trim(coalesce(cargo, ''))) = 'adm'
    );
$function$;

revoke all on function public.usuario_pode_gerenciar_ranking() from public, anon;
grant execute on function public.usuario_pode_gerenciar_ranking() to authenticated;
