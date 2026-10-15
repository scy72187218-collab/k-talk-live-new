create or replace function public.ktalk_listing_details_valid_20261015(d jsonb) returns boolean language plpgsql immutable as $$
declare c text; k text; g jsonb;
begin
 if jsonb_typeof(d)<>'object' or octet_length(d::text)>450000 then return false; end if;
 c:=coalesce(d->>'category','general');
 if c not in ('general','level20','subscriber') then return false; end if;
 for k in select jsonb_object_keys(d) loop
  if k not in ('category','gifts','phone','bank','product_name','product_image','icon_image','public_contact') then return false; end if;
 end loop;
 g:=coalesce(d->'gifts','[]'::jsonb);
 if jsonb_typeof(g)<>'array' then return false; end if;
 if jsonb_array_length(g)>(case c when 'subscriber' then 5 when 'level20' then 2 else 0 end) then return false; end if;
 for g in select value from jsonb_array_elements(g) loop
  if jsonb_typeof(g)<>'number' or g::text !~ '^[0-9]+$' or (g::text)::numeric>49 then return false; end if;
 end loop;
 if length(coalesce(d->>'phone',''))>80 or length(coalesce(d->>'bank',''))>120 or length(coalesce(d->>'product_name',''))>80 then return false; end if;
 if length(coalesce(d->>'product_image',''))>190000 or length(coalesce(d->>'icon_image',''))>130000 then return false; end if;
 if coalesce(d->>'product_image','')<>'' and (d->>'product_image') !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$' then return false; end if;
 if coalesce(d->>'icon_image','')<>'' and (d->>'icon_image') !~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$' then return false; end if;
 if c<>'subscriber' and (coalesce(d->>'phone','')<>'' or coalesce(d->>'bank','')<>'' or coalesce(d->>'product_name','')<>'' or coalesce(d->>'product_image','')<>'' or coalesce(d->>'icon_image','')<>'') then return false; end if;
 if (coalesce(d->>'phone','')<>'' or coalesce(d->>'bank','')<>'') and coalesce(d->>'public_contact','false')<>'true' then return false; end if;
 return true;
exception when others then return false;
end; $$;
alter table public.ktalk_live_rooms add column if not exists listing_details jsonb not null default '{}'::jsonb;
alter table public.ktalk_live_rooms add constraint ktalk_live_listing_details_valid_20261015 check (public.ktalk_listing_details_valid_20261015(listing_details));
comment on column public.ktalk_live_rooms.listing_details is 'Host-entered public broadcast listing presentation; never contains payment credentials or authorization grants. Existing row policies unchanged.';
notify pgrst,'reload schema';