-- Permissões mínimas usadas pela Edge Function delete-account.
-- A service_role não é exposta ao navegador; permanece apenas no ambiente da função.

grant select on table public.profiles to service_role;
grant select, delete on table public.feed_posts to service_role;
grant select, update on table public.chat_settings to service_role;
grant select, update on table public.chat_user_mutes to service_role;
grant select, update on table public.community_feedback_replies to service_role;
grant select, update on table public.convites to service_role;
