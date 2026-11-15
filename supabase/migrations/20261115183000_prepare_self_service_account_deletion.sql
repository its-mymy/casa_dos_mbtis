-- Preparação para exclusão voluntária da própria conta.
-- Mantém histórico administrativo sem bloquear a remoção do perfil.

alter table public.chat_user_mutes
  alter column created_by drop not null;

alter table public.chat_user_mutes
  drop constraint if exists chat_user_mutes_created_by_fkey;

alter table public.chat_user_mutes
  add constraint chat_user_mutes_created_by_fkey
  foreign key (created_by) references public.profiles(id)
  on delete set null;

alter table public.community_feedback_replies
  alter column admin_id drop not null;

alter table public.community_feedback_replies
  drop constraint if exists community_feedback_replies_admin_id_fkey;

alter table public.community_feedback_replies
  add constraint community_feedback_replies_admin_id_fkey
  foreign key (admin_id) references public.profiles(id)
  on delete set null;
