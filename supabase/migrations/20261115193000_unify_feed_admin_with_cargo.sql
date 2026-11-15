-- Unifica a autorização administrativa do FEED com profiles.cargo = 'adm'.
-- A checagem é feita no banco, portanto não depende de flags no navegador.

create or replace function private.feed_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and lower(btrim(coalesce(p.cargo, ''))) = 'adm'
  );
$function$;
