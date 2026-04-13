-- safe/general auth overview by user
-- replace <user_id> with a real users.id value
with target as (
	select '<user_id>'::text as user_id
)
select
	u.id as user_id,
	u.email,
	u.name,
	u.role,
	coalesce(account_summary.account_count, 0) as account_count,
	coalesce(account_summary.auth_providers, '[]'::jsonb) as auth_providers,
	coalesce(active_session_summary.active_session_count, 0) as active_session_count,
	coalesce(active_session_summary.has_active_session, false) as has_active_session,
	active_session_summary.nearest_active_session_expiry,
	active_session_summary.latest_active_session_expiry
from target t
join users u on u.id = t.user_id
left join lateral (
	select
		count(*)::integer as account_count,
		coalesce(
			(
				select jsonb_agg(provider_rows.provider_id order by provider_rows.provider_id)
				from (
					select distinct a2.providerId as provider_id
					from accounts a2
					where a2.userId = u.id
						and a2.providerId is not null
				) provider_rows
			),
			'[]'::jsonb
		) as auth_providers
	from accounts a
	where a.userId = u.id
) account_summary on true
left join lateral (
	select
		count(*)::integer as active_session_count,
		count(*) > 0 as has_active_session,
		min(s.expiresAt) as nearest_active_session_expiry,
		max(s.expiresAt) as latest_active_session_expiry
	from sessions s
	where s.userId = u.id
		and s.expiresAt > now()
) active_session_summary on true
