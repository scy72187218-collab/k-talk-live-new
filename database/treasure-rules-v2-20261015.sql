alter table public.ktalk_treasure_events add column if not exists promotion_until timestamptz;
alter table public.ktalk_treasure_events add column if not exists rules_version integer not null default 1;
create index if not exists ktalk_treasure_promotion_until_idx on public.ktalk_treasure_events(promotion_until desc);
CREATE OR REPLACE FUNCTION public.ktalk_publish_treasure(p_local_id text,p_host_id text,p_host_name text,p_room_title text,p_room_type text,p_amount integer,p_unlock_at timestamptz)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $f$
declare v_id uuid; v_now timestamptz:=now();
begin
 if nullif(trim(p_local_id),'') is null or nullif(trim(p_host_id),'') is null then raise exception 'treasure_identity_required'; end if;
 insert into public.ktalk_treasure_events(local_id,host_id,host_name,room_title,room_type,amount,placed_at,unlock_at,claim_close_at,promotion_until,rules_version)
 values(p_local_id,p_host_id,coalesce(nullif(p_host_name,''),'호스트'),coalesce(nullif(p_room_title,''),'K-Talk LIVE'),coalesce(nullif(p_room_type,''),'solo'),greatest(1,least(coalesce(p_amount,50),100000)),v_now,v_now+interval '3 minutes',v_now+interval '3 minutes 30 seconds',v_now+interval '30 minutes',2)
 on conflict(local_id) do nothing returning id into v_id;
 if v_id is null then select id into v_id from public.ktalk_treasure_events where local_id=p_local_id and host_id=p_host_id; end if;
 return v_id;
end $f$;
CREATE OR REPLACE FUNCTION public.ktalk_claim_treasure(p_event_id uuid, p_viewer_id text, p_viewer_name text)
 RETURNS TABLE(ok boolean, state text, claim_close_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  e public.ktalk_treasure_events%rowtype;
  c integer;
  v_left integer;
  v_reward integer;
  v_id text := coalesce(nullif(p_viewer_id,''),'guest');
begin
  select * into e from public.ktalk_treasure_events where id=p_event_id for update;
  if not found or not e.active then return query select false,'closed'::text,null::timestamptz; return; end if;
  if now() < e.unlock_at then return query select false,'waiting'::text,e.claim_close_at; return; end if;
  if now() >= e.claim_close_at then return query select false,'closed'::text,e.claim_close_at; return; end if;

  if e.rules_version=2 then
    if v_id in (e.host_id,'viewer_'||e.host_id) or not exists(
      select 1 from public.ktalk_live_viewers v where v.host_id=e.host_id and v.viewer_id=v_id
      and v.active=true and v.updated_at>=now()-interval '60 seconds'
    ) then return query select false,'not_in_room'::text,e.claim_close_at; return; end if;
  end if;

  if exists(select 1 from public.ktalk_treasure_claims where event_id=e.id and viewer_id=v_id) then
    return query select true,'joined'::text,e.claim_close_at; return;
  end if;

  select count(*) into c from public.ktalk_treasure_claims where event_id=e.id;
  if c >= e.amount then
    return query select false,'full'::text,e.claim_close_at; return;
  end if;

  if e.rules_version=2 then
    select greatest(0,e.amount-coalesce(sum(t.reward),0)::integer) into v_left from public.ktalk_treasure_claims t where t.event_id=e.id;
    if v_left<=0 then return query select false,'full'::text,e.claim_close_at; return; end if;
    v_reward:=1+floor(random()*least(v_left,greatest(1,ceil(e.amount/10.0)::integer)))::integer;
    insert into public.ktalk_treasure_claims(event_id,viewer_id,viewer_name,reward)
    values(e.id,v_id,coalesce(nullif(p_viewer_name,''),'K-Talk 회원'),v_reward);
  else
    insert into public.ktalk_treasure_claims(event_id,viewer_id,viewer_name)
    values(e.id,v_id,coalesce(nullif(p_viewer_name,''),'K-Talk 회원'));
  end if;
  return query select true,'joined'::text,e.claim_close_at;
end;
$function$;
CREATE OR REPLACE FUNCTION public.ktalk_settle_treasure(p_event_id uuid)
 RETURNS TABLE(participants integer, base_reward integer, remainder integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  e public.ktalk_treasure_events%rowtype;
  v_viewers integer := 0;
  v_base integer := 0;
  v_rem integer := 0;
begin
  select * into e
    from public.ktalk_treasure_events
   where id=p_event_id
   for update;

  if not found then
    return query select 0,0,0;
    return;
  end if;

  select count(*)::integer into v_viewers
    from public.ktalk_treasure_claims
   where event_id=e.id and viewer_id<>e.host_id;

  if v_viewers > 0 then
    v_base := e.amount / v_viewers;
    v_rem := e.amount % v_viewers;
  else
    v_base := 0;
    v_rem := e.amount;
  end if;

  if e.settled then
    return query select v_viewers,v_base,v_rem;
    return;
  end if;

  if now() < e.claim_close_at then
    return query select -1,0,0;
    return;
  end if;

  if e.rules_version=2 then
    select greatest(0,e.amount-coalesce(sum(t.reward),0)::integer) into v_rem
      from public.ktalk_treasure_claims t where t.event_id=e.id and t.viewer_id<>e.host_id;
    insert into public.ktalk_treasure_claims(event_id,viewer_id,viewer_name,reward)
    values(e.id,e.host_id,e.host_name,v_rem)
    on conflict(event_id,viewer_id) do nothing;
    update public.ktalk_treasure_events set settled=true,active=false,settled_at=now() where id=e.id;
    return query select v_viewers,0,v_rem; return;
  end if;

  insert into public.ktalk_treasure_claims(event_id,viewer_id,viewer_name,reward)
  values(e.id,e.host_id,e.host_name,0)
  on conflict (event_id,viewer_id) do update
    set viewer_name=excluded.viewer_name;

  update public.ktalk_treasure_claims
     set reward=0
   where event_id=e.id;

  if v_viewers > 0 then
    update public.ktalk_treasure_claims
       set reward=v_base
     where event_id=e.id and viewer_id<>e.host_id;

    update public.ktalk_treasure_claims
       set reward=v_rem
     where event_id=e.id and viewer_id=e.host_id;
  else
    update public.ktalk_treasure_claims
       set reward=e.amount
     where event_id=e.id and viewer_id=e.host_id;
  end if;

  update public.ktalk_treasure_events
     set settled=true,active=false,settled_at=now()
   where id=e.id;

  return query select v_viewers,v_base,v_rem;
end;
$function$;
create extension if not exists pg_cron;
select cron.schedule('ktalk_treasure_settle_v2','10 seconds',
  $$select public.ktalk_settle_treasure(e.id) from public.ktalk_treasure_events e where e.rules_version=2 and e.settled=false and e.claim_close_at<=now() order by e.claim_close_at limit 100$$);
