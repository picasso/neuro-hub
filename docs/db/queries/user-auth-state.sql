-- current active auth state by user
-- replace <user_id> with a real users.id value
with target as (
	select '<user_id>'::text as user_id
)
select
	u.id as user_id,
	u.email,
	u.name,
	u.role,
	coalesce(account_linkage.accounts, '[]'::jsonb) as accounts,
	coalesce(active_session_state.active_session_count, 0) as active_session_count,
	active_session_state.nearest_active_session_expiry,
	active_session_state.latest_active_session_expiry,
	coalesce(active_session_state.active_sessions, '[]'::jsonb) as active_sessions
from target t
join users u on u.id = t.user_id
left join lateral (
	select coalesce(
		jsonb_agg(
			jsonb_build_object(
				'rowId', a.id,
				'accountId', a.accountId,
				'providerId', a.providerId,
				'createdAt', a.createdAt,
				'updatedAt', a.updatedAt
			)
			order by a.createdAt, a.id
		),
		'[]'::jsonb
	) as accounts
	from accounts a
	where a.userId = u.id
) account_linkage on true
left join lateral (
	select
		count(*)::integer as active_session_count,
		min(s.expiresAt) as nearest_active_session_expiry,
		max(s.expiresAt) as latest_active_session_expiry,
		coalesce(
			jsonb_agg(
				jsonb_build_object(
					'sessionId', s.id,
					'createdAt', s.createdAt,
					'updatedAt', s.updatedAt,
					'expiresAt', s.expiresAt
				)
				order by s.expiresAt, s.id
			),
			'[]'::jsonb
		) as active_sessions
	from sessions s
	where s.userId = u.id
		and s.expiresAt > now()
) active_session_state on true
