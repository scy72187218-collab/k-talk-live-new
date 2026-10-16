CREATE OR REPLACE FUNCTION public.ktalk_toggle_follow(p_target_id text, p_target_name text DEFAULT ''::text, p_viewer_name text DEFAULT ''::text)
 RETURNS TABLE(now_following boolean, follower_count bigint, following_count bigint, reward_granted boolean, company_roses bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_target text := left(trim(coalesce(p_target_id,'')),80);
  v_viewer text := left(trim(coalesce((current_setting('request.headers', true)::jsonb ->> 'x-ktalk-user-id'),'')),80);
  v_target_name text := left(trim(coalesce(p_target_name,'')),120);
  v_viewer_name text := left(trim(coalesce(p_viewer_name,'')),120);
  v_following boolean := false;
  v_reward integer := 0;
  v_rows integer := 0;
begin
  if v_target='' or v_viewer='' or v_target=v_viewer then
    return query select false,
      (select count(*)::bigint from public.ktalk_user_follows f where f.following_id=v_target),
      (select count(*)::bigint from public.ktalk_user_follows f where f.follower_id=v_target),
      false,
      coalesce((select b.roses from public.ktalk_user_rose_balances b where b.user_id=v_target),0::bigint);
    return;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_viewer || ':' || v_target, 0));
  if exists(select 1 from public.ktalk_user_follows f where f.follower_id=v_viewer and f.following_id=v_target) then
    delete from public.ktalk_user_follows where follower_id=v_viewer and following_id=v_target;
    v_following := false;
  else
    insert into public.ktalk_user_follows(follower_id,follower_name,following_id,following_name,notify_live,created_at,updated_at)
    values(v_viewer,v_viewer_name,v_target,v_target_name,false,now(),now())
    on conflict (follower_id,following_id) do nothing;
    get diagnostics v_rows = row_count;
    v_following := true;

    if v_rows > 0 then
      insert into public.ktalk_follow_rewards(follower_id,following_id,roses)
      values(v_viewer,v_target,1)
      on conflict (follower_id,following_id) do nothing;
      get diagnostics v_reward = row_count;
      if v_reward > 0 then
        insert into public.ktalk_user_rose_balances(user_id,roses,updated_at)
        select x,0,now() from unnest(array[v_viewer,v_target]) x order by x
        on conflict(user_id) do nothing;
        perform b.user_id from public.ktalk_user_rose_balances b
          where b.user_id in(v_viewer,v_target) order by b.user_id for update;
        update public.ktalk_user_rose_balances set roses=roses-1,updated_at=now()
          where user_id=v_viewer and roses>=1;
        if not found then raise exception 'KT_FOLLOW_ROSE_INSUFFICIENT'; end if;
        update public.ktalk_user_rose_balances set roses=roses+1,updated_at=now()
          where user_id=v_target;
      end if;
    end if;
  end if;

  return query select v_following,
    (select count(*)::bigint from public.ktalk_user_follows f where f.following_id=v_target),
    (select count(*)::bigint from public.ktalk_user_follows f where f.follower_id=v_target),
    (v_reward > 0),
    coalesce((select b.roses from public.ktalk_user_rose_balances b where b.user_id=v_target),0::bigint);
end;
$function$
