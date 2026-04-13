-- ordered thread shape example
-- for long threads prefer pagination/cursor loading by (created_at, id)
-- replace <conversation_id> with a real conversations.id value
with target as (
	select '<conversation_id>'::uuid as conversation_id
)
select
	c.id,
	c.context_type,
	c.context_id,
	c.customer_id,
	customer.name as customer_name,
	c.freelancer_id,
	freelancer.name as freelancer_name,
	c.created_by,
	creator.name as created_by_name,
	c.created_at,
	c.updated_at,
	coalesce(member_agg.members, '[]'::jsonb) as members,
	coalesce(message_meta.message_count, 0) as message_count,
	message_meta.first_message_at,
	message_meta.last_message_at,
	coalesce(message_agg.messages, '[]'::jsonb) as messages,
	coalesce(read_state_agg.read_state, '[]'::jsonb) as read_state
from target t
join conversations c on c.id = t.conversation_id
join users customer on customer.id = c.customer_id
join users freelancer on freelancer.id = c.freelancer_id
join users creator on creator.id = c.created_by
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'userId', cm.user_id,
			'userName', u.name,
			'role', cm.role
		)
		order by cm.role, cm.user_id
	) as members
	from conversation_members cm
	join users u on u.id = cm.user_id
	where cm.conversation_id = c.id
) member_agg on true
left join lateral (
	select
		count(*)::integer as message_count,
		min(m.created_at) as first_message_at,
		max(m.created_at) as last_message_at
	from messages m
	where m.conversation_id = c.id
) message_meta on true
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'id', m.id,
			'senderId', m.sender_id,
			'senderName', u.name,
			'text', m.text,
			'createdAt', m.created_at
		)
		order by m.created_at, m.id
	) as messages
	from messages m
	join users u on u.id = m.sender_id
	where m.conversation_id = c.id
) message_agg on true
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'userId', mr.user_id,
			'userName', u.name,
			'lastReadMessageId', mr.last_read_message_id,
			'lastReadMessageCreatedAt', mr.last_read_message_created_at,
			'readAt', mr.read_at,
			'updatedAt', mr.updated_at
		)
		order by mr.user_id
	) as read_state
	from message_reads mr
	join users u on u.id = mr.user_id
	where mr.conversation_id = c.id
) read_state_agg on true
