-- internal auth diagnostics by user
-- use this for provider/session troubleshooting without selecting raw token values
-- replace <user_id> with a real users.id value
with target as (
	select '<user_id>'::text as user_id
)
select
	u.id as user_id,
	u.email,
	u.name,
	u.role,
	coalesce(account_diagnostics.accounts, '[]'::jsonb) as accounts,
	coalesce(session_diagnostics.sessions, '[]'::jsonb) as sessions
from target t
join users u on u.id = t.user_id
left join lateral (
	select coalesce(
		jsonb_agg(
			jsonb_build_object(
				'rowId', a.id,
				'accountId', a.accountId,
				'providerId', a.providerId,
				'scope', a.scope,
				'accessTokenExpiresAt', a.accessTokenExpiresAt,
				'refreshTokenExpiresAt', a.refreshTokenExpiresAt,
				'createdAt', a.createdAt,
				'updatedAt', a.updatedAt
			)
			order by a.createdAt, a.id
		),
		'[]'::jsonb
	) as accounts
	from accounts a
	where a.userId = u.id
) account_diagnostics on true
left join lateral (
	select coalesce(
		jsonb_agg(
			jsonb_build_object(
				'sessionId', s.id,
				'status', case
					when s.expiresAt > now() then 'active'
					else 'expired'
				end,
				'expiresAt', s.expiresAt,
				'createdAt', s.createdAt,
				'updatedAt', s.updatedAt,
				'ipAddress', s.ipAddress,
				'userAgent', s.userAgent
			)
			order by s.expiresAt desc, s.id desc
		),
		'[]'::jsonb
	) as sessions
	from sessions s
	where s.userId = u.id
) session_diagnostics on true
