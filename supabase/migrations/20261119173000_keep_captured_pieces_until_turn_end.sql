-- Keep captured pieces on the board as blockers until the multi-capture ends.

CREATE OR REPLACE FUNCTION public.damas_can_capture(b text[], origin integer, side text)
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'pg_catalog', 'public'
AS $function$
  select public.damas_max_captures(b, origin, side) > 0
$function$;

CREATE OR REPLACE FUNCTION public.damas_max_captures(b text[], origin integer, side text)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  r integer := (origin - 1) / 8;
  c integer := (origin - 1) % 8;
  dr integer;
  dc integer;
  rr integer;
  cc integer;
  idx integer;
  enemy text := case when side = 'w' then 'b' else 'w' end;
  piece text := b[origin];
  work_board text[];
  landing integer;
  best integer := 0;
  candidate integer;
  found_enemy boolean;
  enemy_index integer;
begin
  if origin not between 1 and 64 or lower(coalesce(piece, '')) <> side then
    return 0;
  end if;

  for dr in -1..1 loop
    for dc in -1..1 loop
      if abs(dr) <> 1 or abs(dc) <> 1 then continue; end if;

      if piece in ('w', 'b') then
        rr := r + dr;
        cc := c + dc;
        if rr not between 0 and 7 or cc not between 0 and 7 then continue; end if;
        idx := rr * 8 + cc + 1;
        landing := (r + 2 * dr) * 8 + (c + 2 * dc) + 1;
        if (r + 2 * dr) between 0 and 7
          and (c + 2 * dc) between 0 and 7
          and lower(coalesce(b[idx], '')) = enemy
          and coalesce(b[landing], '') = '' then
          work_board := b;
          work_board[origin] := '';
          work_board[idx] := 'x';
          -- Brazilian draughts: a man that only passes through the crown row
          -- during a multi-capture remains a man until the complete turn ends.
          work_board[landing] := piece;
          candidate := 1 + public.damas_max_captures(work_board, landing, side);
          best := greatest(best, candidate);
        end if;
      else
        rr := r + dr;
        cc := c + dc;
        found_enemy := false;
        enemy_index := 0;
        while rr between 0 and 7 and cc between 0 and 7 loop
          idx := rr * 8 + cc + 1;
          if coalesce(b[idx], '') <> '' then
            if not found_enemy and lower(b[idx]) = enemy then
              found_enemy := true;
              enemy_index := idx;
            else
              exit;
            end if;
          elsif found_enemy then
            work_board := b;
            work_board[origin] := '';
            work_board[enemy_index] := 'x';
            work_board[idx] := piece;
            candidate := 1 + public.damas_max_captures(work_board, idx, side);
            best := greatest(best, candidate);
          end if;
          rr := rr + dr;
          cc := cc + dc;
        end loop;
      end if;
    end loop;
  end loop;
  return best;
end;
$function$;

CREATE OR REPLACE FUNCTION public.damas_move(p_room_code text, p_guest_token text, p_from integer, p_to integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  rm public.damas_rooms%rowtype;
  sec public.damas_room_secrets%rowtype;
  uid uuid := auth.uid();
  side text;
  piece text;
  target text;
  fr integer;
  fc integer;
  tr integer;
  tc integer;
  dr integer;
  dc integer;
  step_r integer;
  step_c integer;
  steps integer;
  k integer;
  idx integer;
  captured integer := 0;
  enemy text;
  b text[];
  next_side text;
  more_capture boolean := false;
  remaining integer;
  outcome text := null;
  new_status text;
  max_before integer := 0;
  max_after integer := 0;
  scan_idx integer;
begin
  select * into rm from public.damas_rooms
  where lower(room_code) = lower(trim(p_room_code)) for update;
  if not found or rm.status <> 'playing' then raise exception 'Partida indisponível.'; end if;

  select * into sec from public.damas_room_secrets where room_id = rm.id;
  if uid is not null and rm.player1_id = uid then side := 'w';
  elsif uid is not null and rm.player2_id = uid then side := 'b';
  elsif uid is null and sec.player1_token_hash = md5(coalesce(p_guest_token, '')) then side := 'w';
  elsif uid is null and sec.player2_token_hash = md5(coalesce(p_guest_token, '')) then side := 'b';
  else raise exception 'Você não pertence a esta partida.'; end if;

  if side <> rm.turn then raise exception 'Não é sua vez.'; end if;
  if p_from not between 1 and 64 or p_to not between 1 and 64 then raise exception 'Jogada fora do tabuleiro.'; end if;

  b := rm.board;
  piece := b[p_from];
  target := b[p_to];
  if lower(coalesce(piece, '')) <> side or coalesce(target, '') <> '' then
    raise exception 'Movimento inválido.';
  end if;

  fr := (p_from - 1) / 8; fc := (p_from - 1) % 8;
  tr := (p_to - 1) / 8; tc := (p_to - 1) % 8;
  dr := tr - fr; dc := tc - fc;
  if abs(dr) <> abs(dc) or dr = 0 then raise exception 'A peça deve andar na diagonal.'; end if;
  steps := abs(dr);
  step_r := case when dr > 0 then 1 else -1 end;
  step_c := case when dc > 0 then 1 else -1 end;
  enemy := case when side = 'w' then 'b' else 'w' end;

  if rm.forced_piece is not null and rm.forced_piece <> p_from then
    raise exception 'Continue a captura com a mesma peça.';
  end if;

  if rm.forced_piece is not null then
    max_before := public.damas_max_captures(b, p_from, side);
  else
    for scan_idx in 1..64 loop
      if lower(coalesce(b[scan_idx], '')) = side then
        max_before := greatest(max_before, public.damas_max_captures(b, scan_idx, side));
      end if;
    end loop;
  end if;

  if piece in ('w', 'b') then
    if steps = 1 then
      if max_before > 0 then raise exception 'A captura é obrigatória.'; end if;
      if (side = 'w' and dr <> -1) or (side = 'b' and dr <> 1) then
        raise exception 'Peça comum só avança no movimento simples.';
      end if;
    elsif steps = 2 then
      idx := (fr + step_r) * 8 + (fc + step_c) + 1;
      if lower(coalesce(b[idx], '')) <> enemy then
        raise exception 'Não há peça adversária para capturar.';
      end if;
      captured := idx;
    else
      raise exception 'Peça comum anda uma casa ou captura duas.';
    end if;
  else
    for k in 1..steps - 1 loop
      idx := (fr + step_r * k) * 8 + (fc + step_c * k) + 1;
      if coalesce(b[idx], '') <> '' then
        if lower(b[idx]) = enemy and captured = 0 then captured := idx;
        else raise exception 'Caminho bloqueado.'; end if;
      end if;
    end loop;
    if max_before > 0 and captured = 0 then raise exception 'A captura é obrigatória.'; end if;
  end if;

  if captured > 0 then b[captured] := 'x'; end if;
  b[p_from] := '';
  b[p_to] := piece;

  if captured > 0 then
    max_after := public.damas_max_captures(b, p_to, side);
    if 1 + max_after <> max_before then
      raise exception 'Pelas regras brasileiras, escolha uma sequência que capture o maior número de peças.';
    end if;
    more_capture := max_after > 0;
  end if;

  -- Promotion occurs only if the entire capture turn ends on the crown row.
  if not more_capture then
    -- Captured pieces block the path until the entire multi-capture is complete.
    for scan_idx in 1..64 loop
      if b[scan_idx] = 'x' then b[scan_idx] := ''; end if;
    end loop;
    if side = 'w' and tr = 0 and piece = 'w' then b[p_to] := 'W';
    elsif side = 'b' and tr = 7 and piece = 'b' then b[p_to] := 'B';
    end if;
  end if;

  next_side := case when more_capture then side when side = 'w' then 'b' else 'w' end;
  select count(*) into remaining from unnest(b) v where lower(v) = enemy;
  if remaining = 0 then outcome := side;
  elsif not more_capture and not public.damas_has_move(b, next_side) then outcome := side;
  end if;
  new_status := case when outcome is null then 'playing' else 'finished' end;

  update public.damas_rooms
  set board = b, turn = next_side,
      forced_piece = case when more_capture then p_to else null end,
      status = new_status, winner_side = outcome,
      result_reason = case when outcome = 'draw' then 'sem_movimentos'
        when remaining = 0 then 'captura_total'
        when outcome is not null then 'bloqueio' else null end,
      updated_at = now(),
      expires_at = case when outcome is not null then now() + interval '5 minutes'
        else now() + interval '2 hours' end
  where id = rm.id;

  if outcome is not null then perform public.damas_record_result(rm.id, outcome); end if;

  return jsonb_build_object(
    'room_code', rm.room_code, 'board', to_jsonb(b), 'turn', next_side,
    'status', new_status, 'winner_side', outcome,
    'player1_name', rm.player1_name, 'player2_name', rm.player2_name,
    'forced_piece', case when more_capture then p_to else null end
  );
end;
$function$;
