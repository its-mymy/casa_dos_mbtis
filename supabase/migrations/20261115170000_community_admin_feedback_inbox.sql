-- Caixa de entrada administrativa para avaliações privadas.
-- Administradores são reconhecidos por private.community_is_admin() (profiles.cargo = 'adm').

create or replace function public.community_admin_list_feedback(p_status text default 'all')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_result jsonb;
begin
  if (select auth.uid()) is null or not (select private.community_is_admin()) then
    raise exception 'Acesso negado.';
  end if;
  if p_status not in ('all','pending','resolved','archived') then
    raise exception 'Filtro inválido.';
  end if;
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id',f.id,'category',f.category,'subject',f.subject,'message',f.message,
      'sender_name',f.sender_name,'status',f.status,'created_at',f.created_at,'updated_at',f.updated_at,
      'replies',coalesce((
        select jsonb_agg(jsonb_build_object('id',r.id,'message',r.message,'created_at',r.created_at) order by r.created_at)
        from public.community_feedback_replies r where r.feedback_id=f.id
      ),'[]'::jsonb)
    ) order by f.created_at desc
  ),'[]'::jsonb)
  into v_result
  from public.community_feedback f
  where p_status='all' or f.status=p_status;
  return v_result;
end;
$$;

create or replace function public.community_admin_reply_feedback(p_feedback_id uuid,p_message text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or not (select private.community_is_admin()) then
    raise exception 'Acesso negado.';
  end if;
  if p_message is null or char_length(btrim(p_message)) not between 2 and 5000 then
    raise exception 'A resposta deve ter entre 2 e 5000 caracteres.';
  end if;
  if not exists(select 1 from public.community_feedback where id=p_feedback_id) then
    raise exception 'Avaliação não encontrada.';
  end if;
  insert into public.community_feedback_replies(feedback_id,admin_id,message)
  values(p_feedback_id,(select auth.uid()),btrim(p_message));
  update public.community_feedback set updated_at=now() where id=p_feedback_id;
  insert into public.community_moderation_logs(actor_id,action,entity_type,entity_id,metadata)
  values((select auth.uid()),'reply','feedback',p_feedback_id,jsonb_build_object('message_length',char_length(btrim(p_message))));
end;
$$;

revoke all on function public.community_admin_list_feedback(text) from public, anon;
revoke all on function public.community_admin_reply_feedback(uuid,text) from public, anon;
grant execute on function public.community_admin_list_feedback(text) to authenticated;
grant execute on function public.community_admin_reply_feedback(uuid,text) to authenticated;
