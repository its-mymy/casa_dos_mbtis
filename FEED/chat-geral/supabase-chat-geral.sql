-- Casa dos MBTIs • chat-geral
-- Execute no SQL Editor do Supabase. Faça backup antes de aplicar em produção.

create table if not exists public.chat_messages (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    content text not null,
    created_at timestamptz not null default now(),
    constraint chat_messages_content_length check (char_length(trim(content)) between 1 and 500)
);

create index if not exists chat_messages_created_at_idx
    on public.chat_messages (created_at desc);

alter table public.chat_messages enable row level security;

-- Remove policies anteriores com estes nomes, se o script for executado novamente.
drop policy if exists "chat_read_authenticated" on public.chat_messages;
drop policy if exists "chat_insert_own_authenticated" on public.chat_messages;

create policy "chat_read_authenticated"
on public.chat_messages for select
to authenticated
using (auth.uid() is not null);

create policy "chat_insert_own_authenticated"
on public.chat_messages for insert
to authenticated
with check (auth.uid() = user_id);

-- Não concedemos UPDATE ou DELETE a membros pelo frontend.
revoke update, delete on public.chat_messages from anon, authenticated;
grant select, insert on public.chat_messages to authenticated;

-- Filtro no servidor: troca termos bloqueados por asteriscos.
-- Edite a lista conforme as regras da comunidade. Não existe filtro perfeito:
-- combine isso com denúncia/moderação e regras claras.
create or replace function public.chat_filter_message()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
    blocked text[] := array[
        'puta', 'puto', 'putaria', 'merda', 'caralho',
        'porra', 'buceta', 'fodase', 'foda-se', 'pênis',
        'vagina', 'sexo explícito'
    ];
    term text;
begin
    new.content := trim(new.content);

    if new.content is null or new.content = '' then
        raise exception 'A mensagem não pode ficar vazia.';
    end if;

    if char_length(new.content) > 500 then
        raise exception 'A mensagem pode ter no máximo 500 caracteres.';
    end if;

    foreach term in array blocked loop
        new.content := regexp_replace(
            new.content,
            '(?i)\m' || regexp_replace(term, '([\\.^$|()\\[\\]{}*+?])', '\\\1', 'g') || '\M',
            repeat('*', greatest(3, char_length(term))),
            'g'
        );
    end loop;

    return new;
end;
$$;

drop trigger if exists chat_filter_message_trigger on public.chat_messages;
create trigger chat_filter_message_trigger
before insert on public.chat_messages
for each row execute function public.chat_filter_message();

-- Retenção de no máximo 20 horas e teto de 500 mensagens.
create or replace function public.chat_cleanup_messages()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    delete from public.chat_messages
    where created_at < now() - interval '20 hours';

    delete from public.chat_messages
    where id in (
        select id
        from public.chat_messages
        order by created_at desc, id desc
        offset 500
    );
end;
$$;

-- A rotina de limpeza não deve ser chamada diretamente por usuários do site.
revoke execute on function public.chat_cleanup_messages() from public, anon, authenticated;

-- Trigger faz a limpeza quando chega mensagem nova, mesmo sem cron.
create or replace function public.chat_cleanup_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    perform public.chat_cleanup_messages();
    return new;
end;
$$;

drop trigger if exists chat_cleanup_after_insert_trigger on public.chat_messages;
create trigger chat_cleanup_after_insert_trigger
after insert on public.chat_messages
for each statement execute function public.chat_cleanup_after_insert();

-- Habilita Realtime para que mensagens novas cheguem aos clientes.
do $$
begin
    alter publication supabase_realtime add table public.chat_messages;
exception
    when duplicate_object then null;
    when undefined_object then
        raise notice 'Publication supabase_realtime não encontrada. Habilite Realtime para chat_messages pelo painel.';
end;
$$;

-- OPCIONAL, recomendado: limpeza agendada periódica, inclusive em períodos sem mensagens.
-- Se pg_cron não estiver habilitado no projeto, habilite a extensão no painel e rode
-- somente este bloco novamente. O trigger acima ainda aplica o limite quando alguém envia.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
    'chat-geral-cleanup-every-10-minutes',
    '*/10 * * * *',
    $$select public.chat_cleanup_messages();$$
);
